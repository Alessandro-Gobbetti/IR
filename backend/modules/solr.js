// Require module
var SolrNode = require('solr-node');

// Create client
var client = new SolrNode({
    host: '127.0.0.1',
    port: '8983',
    core: 'creators',
    protocol: 'http'
});


module.exports = client
