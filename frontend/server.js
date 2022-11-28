// Serves static files inside of dist folder
const express = require('express');
const path = require('path');
let app = express();
app.use(express.static(path.join(__dirname, 'dist')));
const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`)
});
