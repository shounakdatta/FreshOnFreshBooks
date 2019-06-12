const express = require('express')
const app = express()
const path = require('path')
const port = process.env.port ? process.env.port || 4000

app.get('/', async (req, res) => {
    return res.sendFile(path.join(__dirname + '/index.html'))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))