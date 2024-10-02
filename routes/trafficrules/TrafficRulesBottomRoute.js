const express = require("express");
const router = express.Router();
const TrafficRulesBottomModel = require("../../models/trafficrules/TrafficRulesBottomModel");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { uploadConfig, useSharp } = require("../../config/MulterC");

router.post("/traffic-rules-bottom", uploadConfig.single("img"), async (req, res) => {
  try {
    const fileName = `${uuidv4()}-${Date.now()}.webp`;
    const outputPath = path.join(__dirname, "..//public", fileName);
    await useSharp(req.file.buffer, outputPath);
    const imgFile = `/public/${fileName}`;

    const requiredFields = ["description_az", "description_en", "description_ru"];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `missing field ${field}` });
      }
    }

    const createData = new TrafficRulesBottomModel({
      description: {
        az: req.body.description_az,
        en: req.body.description_en,
        ru: req.body.description_ru,
      },
      image: imgFile,
      status: req.body.status,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/traffic-rules-bottom/:id", uploadConfig.single("img"), async (req, res) => {
  try {
    const { id } = req.params;

    const fileName = `${uuidv4()}-${Date.now()}.webp`;
    const outputPath = path.join(__dirname, "..//public", fileName);
    await useSharp(req.file.buffer, outputPath);
    const imgFile = `/public/${fileName}`;

    const { description_az, description_en, description_ru } = req.body;

    const updatedData = await TrafficRulesBottomModel.findByIdAndUpdate(
      id,
      {
        $set: {
          description: {
            az: description_az,
            en: description_en,
            ru: description_ru,
          },
          image: imgFile,
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

router.delete("/traffic-rules-bottom/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await TrafficRulesBottomModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: "data not found." });
    }

    await TrafficRulesBottomModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted data" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/traffic-rules-bottom", async (req, res) => {
  try {
    const data = await TrafficRulesBottomModel.find().lean().exec();
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/traffic-rules-bottomfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await TrafficRulesBottomModel.find({ status: "active" });

    const filteredData = datas?.map((data) => ({
      _id: data._id,
      description: data.description[preferredLanguage],
      image: data.image,
      status: data.status,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/status-update-traffic-rules-bottom/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await TrafficRulesBottomModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Status updated", updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/status-traffic-rules-bottom/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await TrafficRulesBottomModel.findById(id, "status");

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
