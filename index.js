const express = require('express')
const app = express()
const path = require('path')
const port = 4000
let authCode = null

app.get('/', async (req, res) => {
    const { code } = req.query

    if (!authCode && code) {
        authCode = code
        return res.sendFile(path.join(__dirname + '/tokens.html'))
        // fetch(
        //     'https://api.freshbooks.com/auth/oauth/token',
        //     {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             grant_type: "authorization_code",
        //             client_secret: "30aaf2abd5a8c70dd49bc1aff87743626c1c178b68e815d441669f64ab075832",
        //             code: authCode,
        //             client_id: "4d9b451a98341639ac89b962529888e75000493c3776045af1864508f1342901",
        //             redirect_uri: "https://node-on-freshbooks.herokuapp.com/"
        //         })
        //     }
        // )
        //     .then(res => res.json())
        //     .then(res => console.log(res))
        //     .catch(err => console.log(err))
    }
    return res.sendFile(path.join(__dirname + '/authorize.html'))
})

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))