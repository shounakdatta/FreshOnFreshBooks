const express = require('express')
const app = express()
const path = require('path')
const port = 4000
let authCode = null;

app.get('/', async (req, res) => {
    const { code } = req.query

    if (code) {
        authCode = code
        return res.sendFile(path.join(__dirname + '/tokens.html'))
    }
    return res.sendFile(path.join(__dirname + '/authorize.html'))
})

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))