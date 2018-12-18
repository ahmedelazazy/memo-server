var db = require('../models');
var express = require('express');
var router = express.Router();

const Template = db.template;
const Process = db.process;
const Notification = db.notification;

router.get('/', async (req, res) => {
  try {
    let userId = req.userId;
    let notifications = await Notification.findAll({
      where: { userId: userId },
      order: [['id', 'DESC']],
      limit: 50
    });
    res.send(notifications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/new', async (req, res) => {
  try {
    let userId = req.userId;
    let count = await Notification.count({
      where: { userId: userId, isNew: true }
    });
    res.send(count.toString());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let userId = req.userId;
    let id = req.params.id;
    let result = await Notification.update({ isNew: false }, { where: { id, userId } });

    if (!result || !result[0]) {
      return res.status(400).send();
    }

    return res.send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
