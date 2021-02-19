const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jsonfile = require("jsonfile");
const fs = require("fs");
const async = require('async');
const session = require('express-session');


const app = express()
const port = process.env.PORT||3001;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})