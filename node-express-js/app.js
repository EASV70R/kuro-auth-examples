const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const apiKey = '5270283d392663007843f7081aee8b';

const debug = false;

app.use(express.json());

app.use((req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Connection attempt from IP: ${clientIp}`);
    next();
});

app.use((req, res, next) => {
    if (!debug) {
        const secretHeader = req.headers['x-security-header'];
        if (secretHeader !== 'test') {
            const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            console.error(`Failed connection attempt from IP: ${clientIp} due to invalid header`);
            return res.status(403).json({ message: 'Invalid header' });
        }
    }
    next();
});

app.get('/login', async (req, res) => {
    const { username, password } = req.query;

    try {
        const response = await axios.get(`http://kuro.dk/api/api.php`, {
            params: {
                key: apiKey,
                user: username,
                pass: password
            }
        });

        /*if (response.data.status === 'success') {
            res.send(`Login successful for user: ${response.data.data.username}`);
        } else {
            res.send(`Login failed: ${response.data.message}`);
        }*/
        res.json(response.data);
    } catch (error) {
        res.send(`Error: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
