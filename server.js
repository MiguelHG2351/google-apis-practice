const express = require('express');
const { google } = require('googleapis')
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/google/insert', async (req, res) => {
    const { name, lastname, type } = req.body
    console.log(req.body)

    const auth = new google.auth.GoogleAuth({
        keyFile: 'google-api-credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
    })

    // create client instance for auth
    const client = await auth.getClient()

    // instance of google sheets API
    const googleSheet = google.sheets({ version: 'v4', auth: client })

    // spreadsheet id is the long id in the sheets URL
    const spreadsheetId = '1aiQMT3bZW36pOd9cXK-OJuq-9Sw9bkpaTG5muivfpu0'
    
    // Get metadata about spreadsheet
    const metadata = await googleSheet.spreadsheets.get({
        auth,
        spreadsheetId
    })

    // write row to spreadsheet
    const TYPES_OF_INSERT = {
        'client': 'Hoja 1!A:B',
        'office': 'Hoja 1!D:E',
        'employee': 'Hoja 1!G:H',
    }

    await googleSheet.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: TYPES_OF_INSERT[type],
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[name, lastname]],
        },
      });

    res.send("Successfully submitted! Thank you!")
    
})

app.get('/google', async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'google-api-credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
    })

    const client = await auth.getClient()

    const googleSheet = google.sheets({ version: 'v4', auth: client })

    const spreadsheetId = '1aiQMT3bZW36pOd9cXK-OJuq-9Sw9bkpaTG5muivfpu0'
    
    const metadata = await googleSheet.spreadsheets.get({
        auth,
        spreadsheetId
    })

    // multiple range
    let ranges = [
        'Hoja 1!A1:B5',
    ]

    // read row from spreadsheet
    const getRows = await googleSheet.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: ranges
    })

    res.send(getRows.data)  
})

module.exports = app
