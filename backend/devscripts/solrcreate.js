const solr = require("../modules/solr.js");
const path = require("path");
const scrapy = require("../modules/scrapy")
const config = require("../config/config");
const fs = require("fs");


createCollection()

async function createCollection() {
    let file = await fs.readFileSync("../solr/creators_schema_configset.zip")
    console.log(file)

    await scrapy.runConsoleCommand(`curl -X PUT --header "Content-Type:application/octet-stream" --data-binary  @../solr/creators_schema_configset.zip "http://localhost:8983/api/cluster/configs/creators_config?commit=true"`,"./")

    setTimeout(async () => await scrapy.runConsoleCommand(`curl -X POST http://localhost:8983/api/collections?commit=true -H 'Content-Type: application/json' -d '
    {
      "create": {
          "name": "creators",
          "config": 'creators_config',
          "numShards": 2
      }
    }'`, "./"), 1000)

    // await solr.runQuery(`/api/cluster/configs/${config.solr.connection.core}_config`, 'PUT', {
    //     'Content-Type': 'application/octet-stream',
    //     'Accept': 'application/json'
    // }, file).then(console.log).catch(console.log)
    // await solr.runQuery(`/api/collections`, 'POST', {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json'
    // },{
    //     "create": {
    //         "name": config.solr.connection.core,
    //         "config": `${config.solr.connection.core}_config`,
    //         "numShards": 1
    //     }
    // }).then(console.log).catch(console.log)
}