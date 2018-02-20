var express = require('express');
var router = express.Router();
const { author } = require('../methods');

router.get('/', wrapAsync(async function (req, res, next) {
  const authors = await author.readAll(req.query);
  res.send(authors);
}))

router.get('/:id', wrapAsync(async function (req, res, next) {
  const authors = await author.readOne({id: Number(req.params.id)});
  res.send(authors);
}))

router.post('/', wrapAsync(async function (req, res) {
  const result = await author.create(req.body);
  res.send(result);
}))

router.delete('/:id', wrapAsync(async function (req, res) {
  const result = await author.delete({id: Number(req.params.id)});
  res.send(result);
}))

router.put('/:id', wrapAsync(async function (req, res) {
  let methodRequest = {
    id: req.params.id
  }
  methodRequest = Object.assign(methodRequest, req.body);
  const result = await author.update(methodRequest);
  res.send(result);
}))

function wrapAsync(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(next);
  };
}

module.exports = router;