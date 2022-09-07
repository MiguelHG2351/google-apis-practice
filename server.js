const express = require('express');
const { google } = require('googleapis')
const app = express();

app.use(express.static('public'));

app.get('/google/insert', async (req, res) => {
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

    // write row to spreadsheet
    await googleSheet.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Hoja 1!A:B",
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [["To Sleep", "Miguel"]],
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
