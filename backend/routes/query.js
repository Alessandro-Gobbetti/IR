/**
 *
 * / API router
 *
 */

const express = require('express');
const router = express.Router();
const solr = require("../modules/solr")

router.get('/*', function(req, res) {
    // Create query
    // var query = ;
    // var query = solr.query().q(req.url)
    //


    let params = {
        ...req.query,
        indent: true,
        "q.op" : "OR"
    }

    // Search documents using objQuery
    console.log(params)
    solr.search(params).then((result, err) => {
        if (err) {
            console.log(err)
            res.status(501).end()
            return;
        }
        // console.log('Response:', result.response.docs);
        res.json(result.response.docs)
    });

})


module.exports = router;


////////////////

