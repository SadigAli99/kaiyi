const express = require("express");
const router = express.Router();
const TestDriveUserModel = require("../models/TestDriveUsers");

router.post("/register-test-drive", async (req, res) => {
  try {
    const requiredFields = ["name", "model", "city", "telephone", "hours", "created_at"];

    for (field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `missing field ${field}` });
      }
    }

    const saveRegisters = new TestDriveUserModel({
      name: req.body.name,
      model: req.body.model,
      city: req.body.city,
      telephone: req.body.telephone,
      created_at: req.body.created_at,
      hours: req.body.hours,
    });

    const savedData = await saveRegisters.save();

    return res.status(200).json(savedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/register-test-drive", async (req, res) => {
  try {
    const findRequestsUsers = await TestDriveUserModel.find().lean().exec();

    if (!findRequestsUsers) {
      return res.status(404).json({ message: "data not found or other problem" });
    }

    return res.status(200).json(findRequestsUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
