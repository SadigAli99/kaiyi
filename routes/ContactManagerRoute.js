const express = require("express");
const router = express.Router();
const ContactManagerModel = require("../models/ContactManagerModel");

router.post("/contact-manager", async (req, res) => {
  try {
    const requiredFields = ["name", "surname", "telephone", "hours", "created_at"];

    for (field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `missing field ${field}` });
      }
    }

    const saveRegisters = new ContactManagerModel({
      name: req.body.name,
      surname: req.body.surname,
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

router.get("/contact-manager", async (req, res) => {
  try {
    const findRequestsUsers = await ContactManagerModel.find().lean().exec();

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
