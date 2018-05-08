var express = require('express');
var router = express.Router();
const { user } = require('../methods');

router.get('/', wrapAsync(async function (req, res, next) {
  const users = await user.read(req.query);
  res.send(users);
}))

router.post('/', wrapAsync(async function (req, res) {
  const result = await user.create(req.body);
  res.send(result);
}))

router.get('/:id', wrapAsync(async function (req, res) {
  const result = await user.readOne({id: Number(req.params.id)})
  res.send(result);
}))

router.delete('/:id', wrapAsync(async function (req, res) {
  const result = await user.delete({id: Number(req.params.id)});
  res.send(result);
}))

router.put('/:id', wrapAsync(async function (req, res) {
  let methodRequest = {
    id: req.params.id
  }
  methodRequest = Object.assign(methodRequest, req.body);
  const result = await user.update(methodRequest);
  res.send(result);
}))

function wrapAsync(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(next);
  };
}

module.exports = router;