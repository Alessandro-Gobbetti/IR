/**
 *
 * / API router
 *
 */

const express = require('express');
const router = express.Router();
const solr = require("../modules/solr")

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
router.get('/*', function(req, res) {
    // TODO: Add term weight
    let params = {
        ...parse_query_fields(req.query),
        params: {
            "q.op": "OR",
            "df" : "all",
            "indent" : true
        },
        fields: "*,score"
    }

    // Search documents using objQuery
    solr.runSearchQuery(params)
        .then((response)=> {
            const stats = {
                found: response.response.numFound
            }
            const results = {stats, docs: response.response.docs}
            console.log("RESPONSE:\n",response)
            res.json(results)
        })
        .catch((err)=>{
            console.log("ERROR:\n",err)
            res.status(500).end()
        })
})


module.exports = router;


////////////////

