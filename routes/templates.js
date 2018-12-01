var models = require('../models');
var express = require('express');
var router = express.Router();

const Step = models.step;
const Control = models.control;
const Section = models.section;
const Op = models.Sequelize.Op;

router.get('/', async (req, res) => {
  try {
    var templates = await models.template.findAll({
      include: [{ model: models.step }]
    });
    res.json(templates);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    var id = req.params.id;
    var template = await models.template.findOne({
      where: { id: id },
      include: [
        { model: models.step, include: [{ model: models.control }] },
        { model: models.section, include: [{ model: models.control }] }
      ]
    });
    res.json(template);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    var inputTemplate = req.body.template;
    inputTemplate.userId = req.userId;
    inputTemplate.hasForm = inputTemplate.sections && inputTemplate.sections.length > 0;
    var templateResult = await models.template.create(inputTemplate, {
      include: [{ model: models.step }, { model: models.section, include: [{ model: models.control }] }]
    });
    var template = templateResult.get({ plain: true });

    if (template.hasForm) {
      let sectionIds = template.sections.map(s => s.id);
      let controlTemplateIdUpdates = await Control.update(
        { templateId: template.id },
        { where: { sectionId: { [Op.in]: sectionIds } } }
      );
    }

    var controlConfig = req.body.controlConfig;

    if (controlConfig) {
      const ControlConfig = models.controlConfig;

      let controls = [];
      if (template.sections) {
        for (let i = 0; i < template.sections.length; i++) {
          const section = template.sections[i];
          if (section.controls && section.controls.length > 0) {
            controls.push(...section.controls);
          }
        }
      }

      for (let i = 0; i < controlConfig.length; i++) {
        const step = controlConfig[i];

        if (step && step.controls) {
          for (let j = 0; j < step.controls.length; j++) {
            const control = {
              visibility: step.controls[j].visibility,
              config: step.controls[j].config,
              controlUiId: step.controls[j].controlUiId
            };

            control.templateId = template.id;

            let tempStep = template.steps.find(s => s.stepUiId == step.stepUiId);
            control.stepId = tempStep.id;

            let tempControl = controls.find(c => c.controlUiId == control.controlUiId);
            control.controlId = tempControl.id;

            await ControlConfig.create(control);
          }
        }
      }
    }

    res.json(template);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/test', async (req, res) => {
  try {
    var step1 = await Step.create({
      title: 'hello step 1',
      userId: 1,
      templateId: 1
    });
    var step2 = await Step.create({
      title: 'hello step 2',
      userId: 1,
      templateId: 1
    });
    let steps = [step1, step2];

    var control1 = await Control.create({
      label: 'Control 1',
      sectionId: 1
    });

    res.json({ control: control1, step: step1 });
    // var c1 = {
    //   label: 'Control 1',
    //   SectionId: 1
    // };
    // c1.ControlsConfig = { config: 'test config1', visibility: 'hidden', TemplateId: 1 };

    // var control1 = await Control.create(c1);

    // user.addProject(project, { through: { status: 'started' } });

    // var OK1 = await control1.addStep(step1, {
    //   through: { config: 'test config1', visibility: 'hidden', TemplateId: 1 }
    // });

    // var OK2 = await control1.addSteps([step1], {
    //   through: { config: 'test config2', visibility: 'hidden', TemplateId: 1 }
    // });

    // var OK3 = await control1.setSteps([step1], {
    //   through: { config: 'test config3', visibility: 'hidden', TemplateId: 1 }
    // });

    // var OK4 = await step1.addControl(control1, {
    //   through: { config: 'test config1', visibility: 'hidden', TemplateId: 1 }
    // });

    // var OK5 = await step1.addControls([control1], {
    //   through: { config: 'test config2', visibility: 'hidden', TemplateId: 1 }
    // });

    // var OK6 = await step1.setControls([control1], {
    //   through: { config: 'test config3', visibility: 'hidden', TemplateId: 1 }
    // });

    var result1 = { OK1, OK2, OK3, OK4, OK5, OK6 };
    res.json(result1);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
