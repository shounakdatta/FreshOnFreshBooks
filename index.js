const express = require('express')
const app = express()
const path = require('path')
const port = 5000
const fetch = require('node-fetch')

const clientId = '4d9b451a98341639ac89b962529888e75000493c3776045af1864508f1342901'
const clientSecret = '30aaf2abd5a8c70dd49bc1aff87743626c1c178b68e815d441669f64ab075832'
const accessTokenUri = 'https://api.freshbooks.com/auth/oauth/token'
const authorizationUri = 'https://my.freshbooks.com/service/auth/oauth/authorize'
const redirectUri = 'https://node-on-freshbooks.herokuapp.com/'
let authCode = null

// const ClientOAuth2 = require('client-oauth2')

// const clientAuth = new ClientOAuth2({
//     clientId: '4d9b451a98341639ac89b962529888e75000493c3776045af1864508f1342901',
//     clientSecret: '30aaf2abd5a8c70dd49bc1aff87743626c1c178b68e815d441669f64ab075832',
//     accessTokenUri: 'https://api.freshbooks.com/auth/oauth/token',
//     authorizationUri: 'https://my.freshbooks.com/service/auth/oauth/authorize',
//     redirectUri: 'https://node-on-freshbooks.herokuapp.com/'
// })

app.get('/', (req, res) => {
    const { code } = req.query

    if (code) {
        authCode = code
        return res.sendFile(path.join(__dirname + '/tokens.html'))
    }
    return res.sendFile(path.join(__dirname + '/authorize.html'))
})

app.get('/api/authorize/', (req, res) => {
    let uri = authorizationUri + "?client_id=" + clientId +
        "&redirect_uri=" + redirectUri + "&scope=&response_type=code&state="
    res.redirect(uri)
})

app.get('/api/tokens/', async (req, res) => {
    const tokenObj = fetch(
        accessTokenUri,
        {
            method: 'POST',
            headers: {
                'Api-version': 'alpha',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    'grant_type': 'authorization_code',
                    'client_secret': clientSecret,
                    'code': authCode,
                    'client_id': clientId,
                    'redirect_uri': redirectUri
                }
            )
        }
    )
        .then(result => result.json())
    // .then(result => res.send(JSON.stringify(result)))
    res.send(JSON.stringify(tokenObj))
    // console.log("clientAuth");
    // const request = { ...req, query: { code: authCode } }
    // await clientAuth.code.getToken(request)
    //     .then(user => res.send(JSON.stringify({ success: true, ...user })))
    //     .catch(err => res.send(JSON.stringify({ success: false, ...err })))
})


app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))