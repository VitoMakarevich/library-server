const {port} = require('./config/express.config');
const bodyParser = require('body-parser');
const routes = require('./routes');
const express = require('express');

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(req.query);
    next()
})

app.use('/authors', routes.author);
app.use('/users', routes.user);
app.use('/books', routes.book);
app.use('/bindings', routes.binding);

app.use((err, req, res, next) => {
    console.log(err);
    return res.status(500).json({
        error: 'Internal Server Error'
      });
});

app.listen(port, (error) => {
    console.log(`Server started ${new Date()} on port ${port}`);
});