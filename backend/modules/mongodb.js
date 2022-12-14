const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const config = require('../config/config.js')
/**
 * Fetches the database and the collections.
 */

///// PARAMETERS
const {mongodb_uri, db_name, collections} = config.mongodb
////////////////////

const model = {}
MongoClient
    .connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(client => {
        model.db = client.db(db_name);
        collections.forEach(k => {
            model[k] = model.db.collection(k)
        })
        model.tags.createIndex({ tag: 1 })
        model.searches.createIndex({ query: 1 })

        console.log("[+] Fetched MongoDB database and collections")
    })


async function addScrapedTag(tag={}, date= new Date().toISOString()) {
    if(tag.tag === undefined)
        return
    // console.log(date)
    await model.tags.replaceOne({tag: tag.tag}, {...tag, date}, {upsert: true});
}

async function addScrapedTags(tags = []) {
    const date = new Date().toISOString()
    tags = tags.map((tag)=>addScrapedTag({tag},date))

    await Promise.all(tags)
}

async function getExpiredTags(limit=1000) {
    var expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - config.scrapy.scrape_expiry_time);
    return await model.tags.find({ date: { $lte: expiredDate.toISOString() } } ).sort({date: 1}).limit(limit).toArray()
}

async function removeTags(tags=[]) {
    await model.tags.deleteMany({tag:{"$in":tags}})
}

async function removeAllTags() {
    await model.tags.deleteMany()
}

// setTimeout(()=>removeTags(["2","1"]),1000)
// setTimeout(()=>removeSearchQueries([null,"1"]),1000)


async function addSearchQuery(query, description, date= new Date().toISOString()) {
    if(query === undefined)
        return
    await model.searches.replaceOne({query: query}, {query, description, date}, {upsert: true});
}

async function getSearchQueriesToScrape(limit=1000) {
    return await model.searches.find().sort({date: 1}).limit(limit).toArray()
}

async function removeSearchQueries(queries=[]) {
    await model.searches.deleteMany({query:{"$in":queries}})
}

async function removeAllSearchQueries() {
    await model.searches.deleteMany()
}

module.exports = {
    addScrapedTags,
    getExpiredTags,
    removeTags,
    removeAllTags,

    addSearchQuery,
    getSearchQueriesToScrape,
    removeSearchQueries,
    removeAllSearchQueries
}