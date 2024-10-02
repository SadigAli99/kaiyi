const express = require("express");
const router = express.Router();
const DesignTabModel = require("../../models/modelinnertabs/DesignTabModel");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { uploadConfig, useSharp } = require("../../config/MulterC");

router.post("/modeldesigntab", uploadConfig.single("img"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "image field is required!" });
    }
    const fileName = `${uuidv4()}-${Date.now()}.webp`;
    const outputPath = path.join(__dirname, "..//public", fileName);

    await useSharp(req.file.buffer, outputPath);

    const imgFile = `/public/${fileName}`;

    const requiredFields = ["color", "titleAz", "titleEn", "titleRu", "selected_model"];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `missing field ${field}` });
      }
    }

    const createData = new DesignTabModel({
      title: {
        az: req.body.titleAz,
        en: req.body.titleEn,
        ru: req.body.titleRu,
      },
      description: {
        az: req.body.descriptionAz,
        en: req.body.descriptionEn,
        ru: req.body.descriptionRu,
      },
      carImage: imgFile,
      color: req.body.color,
      selected_model: req.body.selected_model,
      status: req.body.status,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/modeldesigntab/:id", uploadConfig.single("img"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ msg: "image field is required!" });
    }
    const fileName = `${uuidv4()}-${Date.now()}.webp`;
    const outputPath = path.join(__dirname, "..//public", fileName);

    await useSharp(req.file.buffer, outputPath);

    const imgFile = `/public/${fileName}`;

    const { titleAz, titleEn, titleRu, selected_model } = req.body;

    const updatedData = await DesignTabModel.findByIdAndUpdate(
      id,
      {
        $set: {
          title: {
            az: titleAz,
            en: titleEn,
            ru: titleRu,
          },
          description: {
            az: req.body.descriptionAz,
            en: req.body.descriptionEn,
            ru: req.body.descriptionRu,
          },
          carImage: imgFile,
          color: req.body.color,
          selected_model: selected_model,
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

router.delete("/modeldesigntab/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await DesignTabModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: "data not found." });
    }

    await DesignTabModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted data" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/modeldesigntab", async (req, res) => {
  try {
    const data = await DesignTabModel.find().lean().exec();
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/modeldesigntabfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await DesignTabModel.find({ status: "active" });

    const filteredData = datas?.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      color: data.color,
      carImage: data.carImage,
      selected_model: data.selected_model,
      status: data.status,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/status-update-modeldesigntab/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await DesignTabModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Status updated", updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/status-modeldesigntab/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await DesignTabModel.findById(id, "status");

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
