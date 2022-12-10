/**
 *
 * / API router
 *
 */

const express = require('express');
const router = express.Router();
const solr = require("../modules/solr")
const config = require("../config/config")

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
 * GET query/*
 *
 * Runs a search query and returns the ranked documents.
 */
router.get('/*', async function (req, res) {
    // Measure request execution time. Gets sent to the client as a stat
    const t1 = process.hrtime();

    // TODO: Add term weight
    let params = {
        ...parse_query_fields(req.query),
        params: {
            "q.op": "OR",
            "df": "all",
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
                page: parseInt(Math.floor(response.response.start / config.solr.query.page_size)),
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

