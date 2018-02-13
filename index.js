const {port} = require('./config/express.config');

const express = require('express');
const app = express();

const routes = require('./routes');

app.use('/authors', routes.authors);

app.listen(port, (error) => {
    console.log(`Server started ${new Date()} on port ${port}`);
});