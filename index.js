const express = require('express')
const app = express()
const path = require('path')

app.get('/', async (req, res) => {
    return res.sendFile(path.join(__dirname + '/index.html'))
})

app.listen(process.env.PORT || 4000, () => console.log(`Example app listening on port ${port}!`))