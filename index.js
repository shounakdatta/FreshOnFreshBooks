const express = require('express')
const app = express()
const path = require('path')
const port = 5001
const fetch = require('node-fetch')

const clientId = '4d9b451a98341639ac89b962529888e75000493c3776045af1864508f1342901'
const clientSecret = '30aaf2abd5a8c70dd49bc1aff87743626c1c178b68e815d441669f64ab075832'
const accessTokenUri = 'https://api.freshbooks.com/auth/oauth/token'
const authorizationUri = 'https://my.freshbooks.com/service/auth/oauth/authorize'
const accountInfoUri = 'https://api.freshbooks.com/auth/api/v1/users/me'
const redirectUri = 'https://node-on-freshbooks.herokuapp.com/'
const otherIncomeUri = 'https://api.freshbooks.com/accounting/account/<accountid>/other_incomes/other_incomes'
let authCode = null
let tokenObj = null
let accountInfo = null

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

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

app.get('/api/tokens', async (req, res) => {
    tokenObj = await fetch(
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
    ).then(result => result.json())

    const { token_type, access_token } = tokenObj;
    accountInfo = await fetch(
        accountInfoUri,
        {
            headers: {
                'Authorization': "Bearer" + " " + access_token,
                'Api-version': 'alpha',
                'Content-Type': 'application/json'
            }
        }
    ).then(result => result.json())

    res.sendFile(path.join(__dirname + '/success.html'))
})

app.get('/api/showTokenData', (req, res) => {
    const { access_token, refresh_token } = tokenObj
    const { response } = accountInfo
    const data = {
        accountId: response.id,
        accessToken: access_token,
        refreshToken: refresh_token
    }
    res.send(JSON.stringify(data))
})

app.get('/api/refreshTokens', async (req, res) => {
    const { refresh_token } = tokenObj
    tokenObj = await fetch(
        accessTokenUri,
        {
            method: 'POST',
            headers: {
                'Api-version': 'alpha',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    'grant_type': 'refresh_token',
                    'client_secret': clientSecret,
                    'refresh_token': refresh_token,
                    'client_id': clientId,
                    'redirect_uri': redirectUri
                }
            )
        }
    ).then(result => result.json())
    res.sendFile(path.join(__dirname + '/success.html'))
})

app.get('/otherIncomeForm', (req, res) => {
    res.sendFile(path.join(__dirname + '/otherIncomeForm.html'))
})

app.post('/api/createOtherIncome', async (req, res) => {
    const { roles } = accountInfo
    console.dir(accountInfo.roles)
    const { amount, code, date } = req.body
    const newIncome = {
        "amount": {
            amount,
            code
        },
        "category_name": "online_sales",
        date,
        "note": "Han Solo portrait",
        "payment_type": "PayPal",
        "source": "Etsy",
        "taxes": [
            {
                "amount": "3",
                "name": "HST"
            },
            {
                "amount": "10",
                "name": "Empire Tax"
            }
        ]
    }
    const uri = otherIncomeUri.replace('<accountid>', roles[0].accountid)
    const submittedIncome = await fetch(
        uri,
        {
            method: 'POST',
            headers: {
                'Api-version': 'alpha',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ other_income: newIncome })
        }
    ).then(res => res.json())
    res.send(submittedIncome)
})

app.get('/api/getOtherIncomes', async (req, res) => {
    const { roles } = accountInfo
    const uri = otherIncomeUri.replace('<accountid>', roles[0].accountid)
    const incomes = await fetch(
        uri,
        {
            method: 'GET',
            headers: {
                'Api-version': 'alpha',
                'Content-Type': 'application/json'
            }
        }
    ).then(res => res.json())
    res.send(incomes)
})


app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))