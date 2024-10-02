const express = require("express");
const router = express.Router();
const TrafficRulesCallModel = require("../../models/trafficrules/TrafficRulesCallModel");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { uploadConfig, useSharp } = require("../../config/MulterC");

router.post("/traffic-rules-call", uploadConfig.none(), async (req, res) => {
  try {
    const requiredFields = [
      "title_az",
      "title_en",
      "title_ru",
      "description_az",
      "description_en",
      "description_ru",
      "telephone",
    ];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `missing field ${field}` });
      }
    }

    const createData = new TrafficRulesCallModel({
      title: {
        az: req.body.title_az,
        en: req.body.title_en,
        ru: req.body.title_ru,
      },
      description: {
        az: req.body.description_az,
        en: req.body.description_en,
        ru: req.body.description_ru,
      },
      miniTitle: {
        az: req.body.miniTitleAz,
        en: req.body.miniTitleEn,
        ru: req.body.miniTitleRu,
      },
      telephone: req.body.telephone,
      status: req.body.status,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/traffic-rules-call/:id", uploadConfig.none(), async (req, res) => {
  try {
    const { id } = req.params;

    const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;

    const updatedData = await TrafficRulesCallModel.findByIdAndUpdate(
      id,
      {
        $set: {
          title: {
            az: title_az,
            en: title_en,
            ru: title_ru,
          },
          description: {
            az: description_az,
            en: description_en,
            ru: description_ru,
          },
          miniTitle: {
            az: req.body.miniTitleAz,
            en: req.body.miniTitleEn,
            ru: req.body.miniTitleRu,
          },
          telephone: req.body.telephone,
          status: req.body.status,
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

router.delete("/traffic-rules-call/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await TrafficRulesCallModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: "data not found." });
    }

    await TrafficRulesCallModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted data" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/traffic-rules-call", async (req, res) => {
  try {
    const data = await TrafficRulesCallModel.find().lean().exec();
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/traffic-rules-callfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await TrafficRulesCallModel.find({ status: "active" });

    const filteredData = datas?.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      miniTitle: data.miniTitle[preferredLanguage],
      telephone: data.telephone,
      status: data.status,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/status-update-traffic-rules-call/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await TrafficRulesCallModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Status updated", updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/status-traffic-rules-call/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await TrafficRulesCallModel.findById(id, "status");

    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json({ message: "Status fetched successfully", status: data.status });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
