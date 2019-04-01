const express = require('express');
const PORT = process.env.PORT || 3000;
const path = require('path');
const INDEX = path.join(__dirname, 'index.html');
server = express()
server.use((req, res) => res.sendFile(INDEX)).listen(PORT, () => console.log(`Listening on ${ PORT}`));
