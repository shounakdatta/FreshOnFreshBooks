const express = require('express')
const app = express()
const path = require('path')
const port = 4000
let authCode = null

const ClientOAuth2 = require('client-oauth2')

const clientAuth = new ClientOAuth2({
    clientId: '4d9b451a98341639ac89b962529888e75000493c3776045af1864508f1342901',
    clientSecret: '30aaf2abd5a8c70dd49bc1aff87743626c1c178b68e815d441669f64ab075832',
    accessTokenUri: 'https://api.freshbooks.com/auth/oauth/token',
    authorizationUri: 'https://my.freshbooks.com/service/auth/oauth/authorize',
    redirectUri: 'https://node-on-freshbooks.herokuapp.com/'
})

app.get('/', (req, res) => {
    const { code } = res.query
    console.log(code);

    return res.sendFile(path.join(__dirname + '/authorize.html'))
})

app.get('/api/authorize', (req, res) => {
    const uri = clientAuth.code.getUri()
    res.redirect(uri)
})

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))

module.exports = clientAuth;