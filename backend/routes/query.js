/**
 *
 * / API router
 *
 */

const express = require('express');
const router = express.Router();
const solr = require("../modules/solr")
const config = require("../config/config")
const {runSearchQuery} = require("../modules/solr");

/**
 * Builds a Solr JSON query object from an object. Removes undefined fields.
 * @param obj the object with which to build a Solr JSON query object.
 * @returns {Object} the Solr JSON query object.
 */
function parse_query_fields(obj) {
    let res = {
        query : obj.q,
    }
    Object.keys(res).forEach(key=>{if(key===undefined) delete res[key]})
    return res
}

/**
 * GET /query/stats
 * Returns all the available filter values/ranges
 */
router.get('/stats', async function (req, res) {
    await runSearchQuery({
        query: "*:*",
        params : {
            'facet' : 'on',
            'facet.field': ["site","tags"],
            'facet.sort' :'count',

            'facet.limit': '-1'
        },
        'facet' : {
            "min_subs" : "min(amount_subs)",
            "max_subs" : "max(amount_subs)",

            "min_price" : "min(price_tiers_monthly)",
            "max_price" : "max(price_tiers_monthly)",
        },
        limit: 0
    }).then(data=> {
        function map_facet_count(facet_field) {
            let res = []
            for(let i = 0 ; i<facet_field.length ; i+=2) {
                res.push({site: facet_field[i], value: facet_field[i+1]})
            }
            return res
        }
        const sites = data.facet_counts.facet_fields.site
        const tags = data.facet_counts.facet_fields.tags

        res.json({
            sites: map_facet_count(sites),
            tags: map_facet_count(tags),

            price: [data.facets.min_price, data.facets.max_price],
            subs: [data.facets.min_subs, data.facets.max_subs],
        })
    }).catch(console.log)

})

/**
 * GET query/*
 *
 * Runs a search query and returns the ranked documents.
 */
router.get('/*', async function (req, res) {
    // Measure request execution time. Gets sent to the client as a stat
    const t1 = process.hrtime();

    // example
    //    http://localhost:8983/solr/techproducts/select?q=video&defType=edismax&qf=features^20.0+text^0.3


        // TODO: Add term weight
    let params = {
        ...parse_query_fields(req.query),
        params: {
            defType : 'edismax',
            qf: ['artist_name^200.0','bio^2.0', "bio_long", "tags^10.0", 'socialmedias^2', 'site^0.5'],
            df: ['artist_name','bio', "bio_long", "tags", 'socialmedia', 'site'],
            // bq: 'cat:electronics^5.0',
            // boost: "amount_subs",
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
            console.log("RESPONSE:\n", response)
            res.json(results)
        })
        .catch((err) => {
            console.log("ERROR:\n", err)
            res.status(500).end()
        })
})


module.exports = router;


////////////////

