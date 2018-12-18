var db = require('../models');
var express = require('express');
var router = express.Router();

const Template = db.template;
const Process = db.process;
const Notification = db.notification;

router.get('/', async (req, res) => {
  try {
    var userId = req.userId;
    var processes = await Process.findAll({
      where: { userId },
      include: [db.user, db.action, { model: db.template, include: [db.step] }],
      order: [['dateOpened', 'DESC']]
    });
    res.json(processes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    let process = req.body;
    process.userId = req.userId;
    process.dateOpened = new Date();
    process.status = 'started';

    let template = await Template.findOne({
      where: { id: process.templateId },
      include: [db.step, db.control]
    });
    process.actions = [];
    for (let i = 0; i < template.steps.length; i++) {
      const step = template.steps[i];
      process.actions.push({
        templateId: template.id,
        stepId: step.id,
        userId: step.userId,
        order: step.order
      });
    }
    let firstAction = process.actions.find(a => a.order == 0);
    firstAction.status = 'assigned';
    firstAction.dateOpened = new Date();

    let processResult = await Process.create(process, { include: [db.action] });

    if (template.hasForm) {
      await processResult.addControls(template.controls, {
        through: { controlValue: null }
      });
    }

    let processObj = processResult.get({ plain: true });
    let notificationAction = processObj.actions.find(a => a.order == 0);

    await Notification.create({
      userId: notificationAction.userId,
      text: 'A new action is assigned to you',
      details: 'A new action is assigned to you',
      entity: 'action',
      entityId: notificationAction.id,
      addedOn: new Date()
    });

    res.send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
