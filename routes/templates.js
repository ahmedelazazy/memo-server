var models = require('../models');
var express = require('express');
var router = express.Router();

const Step = models.Step;
const Control = models.Control;

router.get('/test', async (req, res) => {
  try {
    var step1 = await Step.create({
      title: 'hello step 1',
      UserId: 1,
      TemplateId: 1
    });
    var step2 = await Step.create({
      title: 'hello step 2',
      UserId: 1,
      TemplateId: 1
    });
    let steps = [step1, step2];

    var control1 = await Control.create({
      label: 'Control 1',
      SectionId: 1
    });

    // user.addProject(project, { through: { status: 'started' } });

    var OK = await control1.addStep(step1, {
      through: { TemplateId: 1 }
    });
    res.send('OK');
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post('/', async (req, res) => {
  try {
    var fieldsVisibility = req.body.fieldsVisibility;

    var inputTemplate = req.body.template;
    // inputTemplate.UserId = req.body.UserId;
    var template = await models.Template.create(inputTemplate, {
      include: [{ model: models.Step }, { model: models.Section, include: [{ model: models.Control }] }]
    });
    //then insert the control config by getting the control id and step id
    // for (let i = 0; i < template.Steps.length; i++) {
    //   const step = template.Steps[i];
    //   for (let j = 0; j < step.Controls.length; j++) {
    //     const control = step.Controls[j];
    //     var vis = getVisibility(fieldsVisibility, control);
    //     control.setControlsConfig({ visibility: vis });
    //   }
    // }

    res.json(template);
  } catch (error) {
    res.status(400).send(error);
  }
});

getVisibility = (fieldsVisibility, control) => {
  var vis = fieldsVisibility.find(f => f.field_ui_id == control.controlUiId);
  return vis.visibility;
};

router.get('/', async (req, res) => {
  try {
    var templates = await models.Template.findAll({ include: [{ all: true }] });
    res.json({ templates });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    var id = req.params.id;
    var template = await models.Template.findOne({
      where: { id: id },
      include: [
        { model: models.Step, include: [{ model: models.Control }] },
        { model: models.Section, include: [{ model: models.Control }] }
      ]
    });
    res.json({ template });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
