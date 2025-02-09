// Import required libraries
const express = require('express');
const axios = require('axios');
const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
};
const cheerio = require('cheerio');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const API_ENDPOINT = 'https://example.com/api/endpoint'; // Set your external API endpoint here

app.use(bodyParser.json());

// Utility function to extract a link from email text
function extractLink(emailText) {
    const urlRegex = /(https?:\/\/[\w\-\.]+[\w\/\?=\&\.]+)/g;
    const matches = emailText.match(urlRegex);
    return matches ? matches[0] : null;
}

// REST API to process email body
app.post('/api/parse-email', async (req, res) => {
    try {
        const { emailBody, senderEmail } = req.body;

        if (!emailBody || !senderEmail) {
            return res.status(400).json({ error: 'emailBody and senderEmail are required.' });
        }

        // Extract link from email body
        const link = extractLink(emailBody);
        if (!link) {
            return res.status(400).json({ error: 'No valid link found in email body.' });
        }

        // Scrape the link for meta tags
        const response = await axios.get(link, {
            headers,
        });
        const $ = cheerio.load(response.data);

        const title = $('meta[property="og:title"]').attr('content') || $('title').text();
        const description = $('meta[property="og:description"]').attr('content') || '';

        // Send the meta data and sender email to the external REST API
        const apiResponse = await axios.post(API_ENDPOINT, {
            title,
            description,
            url: link,
            senderEmail,
        });

        // Return the response from the external API
        res.status(200).json({
            message: 'Meta data sent successfully.',
            apiResponse: apiResponse.data,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
