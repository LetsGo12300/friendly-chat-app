const express = require('express');
const dotenv = require('dotenv');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello, World')
})


app.listen(PORT, () => console.log(`App listening on port http://localhost:${PORT}`));
