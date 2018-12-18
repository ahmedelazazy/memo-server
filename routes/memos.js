var db = require('../models');
var express = require('express');
var router = express.Router();
var enums = require('./enums');
var _ = require('lodash');

const Notification = db.notification;
const Memo = db.memo;
const Task = db.task;
const Op = db.Sequelize.Op;

//actions list
router.post('/filter', async (req, res) => {
  try {
    let userId = req.userId;
    let filter = req.body.filter;

    if (!filter) {
      return res.status(400).send();
    }

    let result = undefined;
    if (filter == enums.MemoMode.active) {
      result = await Task.findAll({
        where: {
          userId,
          status: enums.ActionStatus.assigned
        },
        include: [{ model: db.memo, include: [db.user, db.task] }],
        order: [['dateOpened', 'DESC']]
      });
    } else if (filter == enums.MemoMode.inactive) {
      result = await Task.findAll({
        where: {
          userId,
          status: {
            [Op.in]: [enums.ActionStatus.completed_approved, enums.ActionStatus.rejected]
          }
        },
        include: [db.user, { model: db.memo, include: [db.user, db.task] }],
        order: [['dateOpened', 'DESC']]
      }).map(el => el.get({ plain: true }));

      //   result = result;
      result = _.uniqBy(result, 'memoId');
    }

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//memos list
router.get('/mine', async (req, res) => {
  try {
    let userId = req.userId;
    let memos = await Memo.findAll({
      where: { userId },
      include: [db.user, db.task],
      order: [['dateOpened', 'DESC']]
    });

    res.json(memos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//memo details
router.get('/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let userId = req.userId;
    let task = await Task.findOne({
      where: { id, [Op.or]: [{ userId: userId }, { '$memo.userId$': userId }] },
      include: [
        db.user,
        {
          model: db.memo,
          include: [db.user, { model: db.task, include: [db.user] }]
        }
      ]
    });

    if (!task) {
      return res.status(400).send();
    }

    taskObj = task.get({ plain: true });
    taskObj.memo.tasks = _.sortBy(taskObj.memo.tasks, ['order']);

    res.json(taskObj);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//new memo
router.post('/', async (req, res) => {
  try {
    let memo = req.body;
    let userId = req.userId;
    memo.userId = userId;
    memo.dateOpened = new Date();
    memo.status = enums.ProcessStatus.started;

    if (memo.tasks && memo.tasks.length > 0) {
      let firstTask = memo.tasks.find(t => t.order == 0);
      if (!firstTask) {
        return res.status(400).send('Cannot find order value.');
      }
      firstTask.status = enums.ActionStatus.assigned;
      firstTask.dateOpened = new Date();
    }

    let memoResult = await Memo.create(memo, { include: [db.task] });
    let memoObj = memoResult.get({ plain: true });
    let notificationTask = memoObj.tasks.find(t => t.order == 0);

    await Notification.create({
      userId: notificationTask.userId,
      text: 'A new memo is assigned to you',
      details: 'A new memo is assigned to you',
      entity: 'task',
      entityId: notificationTask.id,
      addedOn: new Date()
    });

    res.send(memoObj.id.toString());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//update action
router.post('/:id', async (req, res) => {
  try {
    let task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.userId,
        status: enums.ActionStatus.assigned
      },
      include: [{ model: db.memo, include: [db.task] }]
    });

    if (!task) {
      return res.status(404).send();
    }

    let toBeAddedTaskList = req.body.tasks;
    if (toBeAddedTaskList && toBeAddedTaskList.length > 0 && req.body.status != enums.ActionStatus.rejected) {
      let currentTasks = task.memo.tasks;

      task.status = req.body.status;
      task.comment = req.body.comment;
      task.dateClosed = new Date();
      task.additionalInfo = JSON.stringify(toBeAddedTaskList);
      await task.save();

      for (let i = task.order + 1; i < currentTasks.length; i++) {
        const existingTask = currentTasks.find(t => t.order == i);
        existingTask.order += toBeAddedTaskList.length;
        await existingTask.save();
      }

      let order = task.order + 1;
      for (let i = 0; i < toBeAddedTaskList.length; i++) {
        const toBeAddedTask = toBeAddedTaskList[i];
        toBeAddedTask.order = order;
        toBeAddedTask.memoId = task.memoId;
        let addedTask = await Task.create(toBeAddedTask);
        await task.memo.addTask(addedTask);
        order++;
      }
    } else {
      await task.update({
        status: req.body.status,
        comment: req.body.comment,
        dateClosed: new Date()
      });
    }

    await db.notification.create({
      userId: task.memo.userId,
      text: 'A new task is compeleted at your process',
      details: 'A new task is compeleted at your process',
      entity: 'task',
      entityId: task.id,
      addedOn: new Date()
    });

    if (task.status == enums.ActionStatus.rejected) {
      await closeMemo(task.memo, enums.ActionStatus.rejected, 'Your memo is rejected');
      res.send();
    } else {
      let nextTask = await Task.findOne({
        where: { order: task.order + 1, memoId: task.memoId }
      });
      if (!nextTask) {
        await closeMemo(task.memo, enums.ActionStatus.completed_approved, 'Your memo is completed');
      } else {
        await nextTask.update({
          status: enums.ActionStatus.assigned,
          dateOpened: new Date()
        });

        await db.notification.create({
          userId: nextTask.userId,
          text: 'A new task is assigned to you',
          details: 'A new task is assigned to you',
          entity: 'task',
          entityId: task.id,
          addedOn: new Date()
        });
      }
      res.send();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

closeMemo = async (memo, status, message) => {
  memo.dateClosed = new Date();
  memo.status = status;
  await memo.save();

  await db.notification.create({
    userId: memo.userId,
    text: message,
    details: message,
    entity: 'memo',
    entityId: memo.id,
    addedOn: new Date()
  });
};

module.exports = router;
