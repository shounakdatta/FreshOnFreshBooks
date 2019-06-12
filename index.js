const express = require('express')
const app = express()
const path = require('path')
const port = 4000

app.get('/', async (req, res) => {
    console.log("test", req.query);

    return res.sendFile(path.join(__dirname + '/index.html'))
})

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))