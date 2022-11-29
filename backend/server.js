const config = require('./config/config.js')
const app = require("./app.js")

const server = require('http').createServer(app);
server.on("listening",()=>{
    console.log(`Express server listening on ${config.webserver.domain}:${server.address().port}`);
})
server.listen(config.webserver.port);
