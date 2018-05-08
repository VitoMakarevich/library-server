var express = require('express');
var router = express.Router();
const { binding } = require('../methods');

router.get('/', wrapAsync(async function (req, res, next) {
  const authors = await binding.readAll(req.query);
  res.send(authors);
}))

router.get('/:id', wrapAsync(async function (req, res, next) {
  const bindings = await binding.readOne({id: Number(req.params.id)});
  res.send(bindings);
}))

router.post('/', wrapAsync(async function (req, res) {
  const result = await binding.create(req.body);
  res.send(result);
}))

router.put('/:id', wrapAsync(async function (req, res) {
  let methodRequest = {
    id: req.params.id
  }
  const result = await binding.finish(methodRequest);
  res.send(result);
}))

function wrapAsync(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(next);
  };
}

module.exports = router;