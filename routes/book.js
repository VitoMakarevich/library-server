var express = require('express');
var router = express.Router();
const { book } = require('../methods');

router.get('/', wrapAsync(async function (req, res, next) {
  const books = await book.readAll(req.query);
  res.send(books);
}))

router.post('/', wrapAsync(async function (req, res) {
  const result = await book.create(req.body);
  res.send(result);
}))

router.get('/:id', wrapAsync(async function (req, res, next) {
  const books = await book.readOne({id: Number(req.params.id)});
  res.send(books);
}))

router.delete('/:id', wrapAsync(async function (req, res) {
  const result = await book.delete({id: Number(req.params.id)});
  res.send(result);
}))

router.put('/:id', wrapAsync(async function (req, res) {
  let methodRequest = {
    id: req.params.id
  }
  methodRequest = Object.assign(methodRequest, req.body);
  const result = await book.update(methodRequest);
  res.send(result);
}))

function wrapAsync(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(next);
  };
}

module.exports = router;