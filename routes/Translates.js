const express = require("express");
const router = express.Router();
const TranslateModel = require("../models/TranslatesModel");

router.post("/translates", async (req, res) => {
  try {
    const { key, azTitle, enTitle, ruTitle } = req.body;

    if (!key || !azTitle || !enTitle || !ruTitle) {
      return res.status(400).json({ message: "missing fields" });
    }

    const existingSomeKeys = await TranslateModel.findOne({ key: key }).exec();
    if (existingSomeKeys) {
      return res.status(409).json({ message: "Some key already exists! Please try again.", status: res.statusCode });
    }

    const newTranslates = new TranslateModel({
      key: key,
      azTitle: azTitle,
      enTitle: enTitle,
      ruTitle: ruTitle,
    });

    await newTranslates.save();

    return res.status(201).json(newTranslates);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/translates/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { az_title, en_title, ru_title } = req.body;

    const updatedData = await TranslateModel.findByIdAndUpdate(
      id,
      {
        $set: {
          azTitle: az_title,
          enTitle: en_title,
          ruTitle: ru_title,
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedData) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updatedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/translates/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await TranslateModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: "data not found." });
    }

    await TranslateModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted data" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/translates", async (req, res) => {
  try {
    const data = await TranslateModel.find();
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/translatesfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage ? acceptLanguage.split(",")[0].split(";")[0] : "az";

    const datas = await TranslateModel.find();

    const languageMap = {
      az: "azTitle",
      en: "enTitle",
      ru: "ruTitle",
    };

    const filteredData = datas.map((data) => ({
      key: data.key,
      text: data[languageMap[preferredLanguage]] || data["azTitle"],
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
