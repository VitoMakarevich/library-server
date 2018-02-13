var express = require('express');
var router = express.Router();
const author = require('../models').author;

router.get('/', async function (req, res) {
  const authors = await author.findAll();
  res.send(authors);
})
// define the about route
router.post('/', function (req, res) {
  res.send('About birds');
})

module.exports = router;