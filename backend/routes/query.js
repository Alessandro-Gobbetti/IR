/**
 *
 * / API router
 *
 */

const express = require('express');
const router = express.Router();
const solr = require("../modules/solr")
const config = require("../config/config")
const mongodb = require("../modules/mongodb")
/**
 * Builds a Solr JSON query object from an object. Removes undefined fields.
 * @param obj the object with which to build a Solr JSON query object.
 * @returns {Object} the Solr JSON query object.
 */
function parse_query_fields(obj) {
    let res = {
        query : obj.q,
        offset: Math.max(0,(obj.page-1||0))*config.solr.query.page_size
    }
    Object.keys(res).forEach(key=>{if(key===undefined) delete res[key]})
    return res
}



function tokenizeQuery(queryFull) {
    if(queryFull === undefined || !queryFull.q)
        return

    let [query, filters] = queryFull.q.split(" AND ");

    if (!query)
        return
    console.log(query, filters)
    let query_arr = query.split(' ');
    for (let i = 0; i < query_arr.length; i++) {
        let word = query_arr[i];
        if (word.length === 0 || word.indexOf(':') !== -1) {
            continue;
        }
        // check if starts and ends with quotes
        if (word[0] === '"' && word[word.length - 1] === '"') {
            // remove quotes
            query_arr[i] = word.slice(1, word.length - 1);
        } else {
            // add stars
            query_arr[i] = `*${word}*`;
        }
    }
    return {q: query_arr.join(' ') + (filters ? " AND "+filters : "")};
}




/**
 * GET /query/stats
 * Returns all the available filter values/ranges.
 */
router.get('/stats', async function (req, res) {
    res.json(await solr.getStatistics())
})


/**
 * POST /query/feedback
 * Allows a user to tell the server to which text query he didn't find satisfying results.
 */
router.post('/feedback', async function (req, res) {
    console.log(req.body)
    await mongodb.addSearchQuery(req.body.query, req.body.description)
    res.end()
})



/**
 * GET /query/mlt
 * Returns "More Like This" artists.
 */
router.get('/mlt', async function (req, res) {
    let params = {
        ...parse_query_fields(req.query),
        params: {
            "mlt.fl": "artist_name,tags,bio,bio_long",
            "mlt.boost": true,
            "mlt.qf": "artist_name^20.0 + tags^15.0 + bio^2.0 + bio_long",

            "mlt.maxdfpct": 50,     // ignore terms occurring in more than 50% of docs
            "mlt.mindf": 1,         // ignore terms occurring just in one document
            "mlt.mintf":0,          // do not ignore any term in the original document
            "mlt.minwl": 3,         // ignore words with less than 3 characters

            "mlt.interestingTerms": "details",
            "indent": true
        },
    }

    // Search documents using objQuery
    solr.runMoreLikeThisQuery(params)
        .then((response)=> {
            console.log("RESPONSE:\n", response)
            res.json(response)
        })
        .catch((err) => {
            console.log("ERROR:\n", err)
            res.status(500).end()
        })
})



/**
 * GET query/*
 *
 * Runs a search query with/without filters and returns the ranked documents.
 */
router.get('/*', async function (req, res) {
    // Measure request execution time. Gets sent to the client as a stat
    const t1 = process.hrtime();



    let params = {
        ...parse_query_fields(tokenizeQuery(req.query)),
        params: {
            defType : 'edismax',
            qf: ['artist_name^200.0','bio^2.0', "bio_long", "tags^10.0", 'socialmedias^2', 'site^0.5'],
            df: ['artist_name','bio', "bio_long", "tags", 'socialmedia', 'site'],
            bf: 'log(amount_subs)',

            "q.op": "OR",
            "indent": true
        },
        fields: "*,score"
    }

    // Search documents using objQuery
    solr.runSearchQuery(params)
        .then((response)=> {
            let time = process.hrtime(t1)
            const stats = {
                found: response.response.numFound,
                page: parseInt(Math.floor(response.response.start / config.solr.query.page_size)) + 1,
                total_pages: parseInt(Math.ceil(response.response.numFound / config.solr.query.page_size)),
                // Request execution time
                exec_time: time[0]+(time[1]/1000000000)
            }
            const results = {stats, docs: response.response.docs}
            res.json(results)
        })
        .catch((err) => {
            console.log("ERROR:\n", err)
            res.status(500).end()
        })
})


module.exports = router;


////////////////

