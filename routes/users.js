var db = require("../models");
var express = require("express");
var router = express.Router();

router.get("/", async (req, res) => {
  try {
    let users = await db.user.findAll({ attributes: ["id", "name", "email"] });
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
      return res.status(400).send();
    }
    let user = await db.user.findOne({
      where: { email, password },
      attributes: ["id", "name", "email"]
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
