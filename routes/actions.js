var db = require('../models');
var express = require('express');
var router = express.Router();

var enums = require('./enums');

const Op = db.Sequelize.Op;
const Action = db.action;

router.get('/', async (req, res) => {
  try {
    let userId = req.userId;
    let actions = await Action.findAll({
      where: { userId },
      include: [db.user, db.step, db.template, { model: db.process, include: [db.user, db.action] }],
      order: [['dateOpened', 'DESC']]
    });

    res.json(actions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let userId = req.userId;
    let id = req.params.id;

    let plainAction = await Action.findOne({
      where: {
        id: id,
        status: {
          [Op.in]: [enums.ActionStatus.assigned, enums.ActionStatus.completed_approved, enums.ActionStatus.rejected]
        }
      }
    });
    if (!plainAction) {
      res.status(404).send();
    }

    let actionResult = await Action.findOne({
      where: { userId, id },
      include: [
        db.user,
        {
          model: db.step,
          include: [
            {
              model: db.control,
              include: [db.section], //{ model: db.process, where: { id: plainAction.processId } }
              through: {
                where: { visibility: { [Op.ne]: enums.FieldVisibility.hidden } }
              }
            }
          ]
        },
        {
          model: db.template,
          include: [{ model: db.step, include: [db.user] }, { model: db.section }]
        },
        {
          model: db.process,
          include: [db.user, { model: db.action, include: [db.user] }]
        }
      ]
    });

    let action = actionResult.get({ plain: true });

    if (action && action.step && action.step.controls) {
      for (let i = 0; i < action.step.controls.length; i++) {
        const ctr = action.step.controls[i];
        ctr.controlValue = await db.controlValue.findOne({
          where: { controlId: ctr.id, processId: plainAction.processId }
        });
        ctr.controlValue = ctr.controlValue ? ctr.controlValue.get({ plain: true }) : null;
      }
    }

    // action.step.controls.forEach(control => (control.controlValue = control.processes[0].controlValue));

    action.template.sections.forEach(section => {
      section.controls = action.step.controls.filter(c => c.sectionId == section.id);
    });
    action.step.sections = action.template.sections;

    delete action.step.controls;
    delete action.template.sections;

    res.json(action);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id', async (req, res) => {
  try {
    let controlValues = req.body.controlValues;

    let action = await Action.findOne({
      where: { id: req.params.id, userId: req.userId },
      include: [db.process]
    });

    if (!action) {
      return res.status(404).send();
    }

    await action.update({
      status: req.body.status,
      comment: req.body.comment,
      dateClosed: new Date()
    });

    if (controlValues) {
      for (let i = 0; i < controlValues.length; i++) {
        const cv = controlValues[i];
        await db.controlValue.update({ value: cv.value }, { where: { id: cv.id } });
      }
    }

    await db.notification.create({
      userId: action.process.userId,
      text: 'A new action is added to your process',
      details: 'A new action is added to your process',
      entity: 'action',
      entityId: action.id,
      addedOn: new Date()
    });

    if (action.status == enums.ActionStatus.rejected) {
      await closeProcess(action.process, enums.ActionStatus.rejected, 'Your process is rejected');
      res.send();
    } else {
      let nextAction = await Action.findOne({
        where: { order: action.order + 1, processId: action.processId }
      });
      if (!nextAction) {
        await closeProcess(action.process, enums.ActionStatus.completed_approved, 'Your process is completed');
      } else {
        await nextAction.update({
          status: enums.ActionStatus.assigned,
          dateOpened: new Date()
        });

        await db.notification.create({
          userId: nextAction.userId,
          text: 'A new action is assigned to you',
          details: 'A new action is assigned to you',
          entity: 'action',
          entityId: action.id,
          addedOn: new Date()
        });
      }
      res.send();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

closeProcess = async (process, status, message) => {
  process.dateClosed = new Date();
  process.status = status;
  await process.save();

  await db.notification.create({
    userId: process.userId,
    text: message,
    details: message,
    entity: 'process',
    entityId: process.id,
    addedOn: new Date()
  });
};

module.exports = router;
