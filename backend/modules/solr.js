const {solr, scrapy} = require('../config/config.js')

/**
 * Runs a Solr query with '/select' as the method handler.
 * By default, the limit is set from the config value.
 * @param JSONquery the Solr JSON query object.
 * @returns {Promise<Object>} resolves with Solr's response if the query was carried out successfully and rejects otherwise with the error message.
 */
function runSearchQuery(JSONquery) {
    JSONquery.limit = JSONquery.limit !== undefined ? JSONquery.limit : solr.query.page_size
    return runQueryOnCollection("select", JSONquery)
}

/**
 * Runs a Solr query with '/mlt' as the method handler.
 * By default, the limit is set from the config value.
 * @param JSONquery the Solr JSON query object.
 * @returns {Promise<Object>} resolves with Solr's response if the query was carried out successfully and rejects otherwise with the error message.
 */
function runMoreLikeThisQuery(JSONquery) {
    JSONquery.limit = JSONquery.limit !== undefined ? JSONquery.limit : solr.query.page_size

    // TODO: fix this, figure out how to pass a json body to the query
    let url = `/solr/${solr.connection.core}/mlt?q=${JSONquery.query}&${Object.keys(JSONquery.params).map(key => `${key}=${JSONquery.params[key]}`).join('&')}`
    return runSolrQuery(url, 'POST',
        {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
    // return runQueryOnCollection("mlt", JSONquery)
}

/**
 * Runs a Solr query with '/update' as the method handler.
 * @param {Object} JSONquery the Solr JSON query object.
 * @returns {Promise<Object>} resolves with Solr's response if the query was carried out successfully and rejects otherwise with the error message.
 */
function runUpdateQuery(JSONquery) {
    return runQueryOnCollection("update", JSONquery)
}

/**
 * Runs a Solr query with '/update' as the method handler and the delete keyword.
 * @param {Object} JSONquery the Solr JSON query object.
 * @returns {Promise<Object>} resolves with Solr's response if the query was carried out successfully and rejects otherwise with the error message.
 */
function runDeleteQuery(JSONquery) {
    return runQueryOnCollection("update", {'delete': JSONquery})
}


/**
 * Runs a Solr collection query given a method handler and a JSON query obj.
 * @param {String} method_handler the method handler to be used by Solr.
 * @param {Object} JSONquery the JSON query obj.
 * @returns {Promise<Object>} resolves with Solr's response if the query was carried out successfully and rejects otherwise with the error message.
 */
function runQueryOnCollection(method_handler, JSONquery) {
    return runSolrQuery(`/solr/${solr.connection.core}/${method_handler}?commit=true`, 'POST',
        {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }, JSONquery);
}


/**
 * Runs any Solr query.
 * @param {String} url the URL of the request.
 * @param {String} method the HTTP method to use.
 * @param {Object} header the HTTP header of the request.
 * @param {Object} body the body of the HTTP request.
 * @returns {Promise<Object>} resolves with Solr's response if the query was carried out successfully and rejects otherwise with the error message.
 */
function runSolrQuery(url, method, header, body) {
    return new Promise((resolve, reject) => {
        // console.log(`${solr.protocol}://${solr.host}:${solr.port}/solr/${solr.core}/${method_handler}? -d '${JSON.stringify(params)}'`)
        const requrl = `${solr.connection.protocol}://${solr.connection.host}:${solr.connection.port}${url}`
        console.log(requrl)
        console.log(body)
        fetch(requrl, {
            method: method,
            headers: header,
            ...(body ? {body: JSON.stringify(body)} : {})
        })
            .then((response) => response.json())
            .then((data) => {
                if(data.error)
                    reject(data)
                else
                    resolve(data)
            });
    })
}

// HELPER METHODS


/**
 * Returns the first N documents that are expired and need to be rescraped.
 * @param {Number=2000} limit return the first N expired artists.
 * @returns {Promise<Object[]>} array of expired artists.
 */
async function getExpiredArtists(limit=2000) {
    let params = {
        query: `indexDate:[* TO NOW/DAY-${scrapy.scrape_expiry_time}DAY]`,
        fields: ["site", "page_link", "indexDate"],
        sort: "indexDate asc",
        params: {
            "q.op": "OR"
        },
        limit: limit
    }

    result = []
    await runSearchQuery(params)
        .then((res)=> {
            result = res.response.docs
        })
        .catch((err)=>{
            console.error(err)
        })
    return result
}

/**
 * Returns the statistics about the collection (eg the amount of categories, the min/max amount of subs/prices ecc).
 * @returns {Promise<{subs: [string,string], price: [string,string], sites: [], tags: []}|void>} resolves with the statistics or rejects in case of error.
 */
async function getStatistics() {
    return await runSearchQuery({
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
                res.push({title: facet_field[i], value: facet_field[i+1]})
            }
            return res
        }
        const sites = data.facet_counts.facet_fields.site
        const tags = data.facet_counts.facet_fields.tags

        return {
            sites: map_facet_count(sites),
            tags: map_facet_count(tags),

            price: [data.facets.min_price, data.facets.max_price],
            subs: [data.facets.min_subs, data.facets.max_subs],
        }
    }).catch(console.log)
}

/**
 * Deletes all indexed documents.
 * @returns {Promise<void>} resolves when the operation is completed.
 */
async function deleteAllDocuments() {
    console.log(await runDeleteQuery({query: "*:*"}))
}

module.exports = {
    runSearchQuery,
    runMoreLikeThisQuery,
    runUpdateQuery,
    runSolrQuery,

    getExpiredArtists,
    deleteAllDocuments,
    getStatistics,
}
