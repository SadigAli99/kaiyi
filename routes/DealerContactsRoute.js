const express = require("express");
const router = express.Router();
const DealerContactsModel = require("../models/DealerContactsModel");

router.post("/dealer-contacts", async (req, res) => {
  try {
    const requiredFields = ["name", "surname", "city", "dealerCenter", "hours", "created_at", "email", "telephone"];

    for (field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `missing field ${field}` });
      }
    }

    const saveRegisters = new DealerContactsModel({
      name: req.body.name,
      surname: req.body.surname,
      city: req.body.city,
      telephone: req.body.telephone,
      email: req.body.email,
      dealerCenter: req.body.dealerCenter,
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

router.get("/dealer-contacts", async (req, res) => {
  try {
    const findRequestsUsers = await DealerContactsModel.find().lean().exec();

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
