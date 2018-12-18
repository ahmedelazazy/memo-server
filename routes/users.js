var db = require('../models');
var express = require('express');
var router = express.Router();

router.get('/', async (req, res) => {
  try {
    let users = await db.user.findAll({ attributes: ['id', 'name', 'email', 'createdAt'] });
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let user = await db.user.findOne({ where: { id: req.params.id }, attributes: ['id', 'name', 'email'] });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
      return res.status(400).send();
    }
    let user = await db.user.findOne({
      where: { email, password },
      attributes: ['id', 'name', 'email', 'createdAt']
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    let result = await db.user.create(req.body);
    return res.send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id', async (req, res) => {
  try {
    await db.user.update(req.body, { where: { id: req.params.id } });
    return res.send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.user.update(req.body, { where: { id: req.params.id } });
    return res.send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
