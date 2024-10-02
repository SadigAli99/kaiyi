const express = require("express");
const router = express.Router();
const SubscribeNewsModel = require("../models/SubscribeNews");

router.post("/subscribeNews", async (req, res) => {
  try {
    const { email, created_at } = req.body;

    if (!email || !created_at) {
      return res.status(400).json({ message: "required field" });
    }

    const saveEmails = new SubscribeNewsModel({
      email: email,
      created_at: created_at,
    });

    const saved = await saveEmails.save();

    return res.status(200).json({ saved: saved });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/subscribeNews", async (req, res) => {
  try {
    const emails = await SubscribeNewsModel.find().lean().exec();
    return res.status(200).json(emails);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
