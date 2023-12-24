const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const apiKey = 'APIKEY';

app.use(express.json());

app.get('/login', async (req, res) => {
    const { username, password } = req.query;

    try {
        const response = await axios.get(`APIENDPOINT`, {
            params: {
                key: apiKey,
                user: username,
                pass: password
            }
        });

        if (response.data.status === 'success') {
            res.send(`Login successful for user: ${response.data.data.username}`);
        } else {
            res.send(`Login failed: ${response.data.message}`);
        }
    } catch (error) {
        res.send(`Error: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
