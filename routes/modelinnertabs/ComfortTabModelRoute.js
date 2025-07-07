const express = require("express");
const router = express.Router();
const ComfortTabModel = require("../../models/modelinnertabs/ComfortTabModel");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { uploadConfig, useSharp } = require("../../config/MulterC");
const diskMountPath = require("../../config/mountPath");

router.post("/modelcomfortab", uploadConfig.single("img"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "image field is required!" });
    }
    const fileName = `${uuidv4()}-${Date.now()}.webp`;
    const outputPath = path.join(diskMountPath, fileName);
    await useSharp(req.file.buffer, outputPath);
    const imgFile = `/public/${fileName}`;

    const requiredField = ["selected_model"];

    for (field of requiredField) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing field ${field}` });
      }
    }



    const createData = new ComfortTabModel({
      image: imgFile,
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

router.put("/modelcomfortab/:id", uploadConfig.single("img"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ msg: "image field is required!" });
    }
    const fileName = `${uuidv4()}-${Date.now()}.webp`;
    const outputPath = path.join(diskMountPath, fileName);

    await useSharp(req.file.buffer, outputPath);

    const imgFile = `/public/${fileName}`;

    const updatedData = await ComfortTabModel.findByIdAndUpdate(
      id,
      {
        $set: {
          image: imgFile,
          selected_model: req.body.selected_model,
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

router.delete("/modelcomfortab/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await ComfortTabModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: "data not found." });
    }

    await ComfortTabModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted data" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/modelcomfortab", async (req, res) => {
  try {
    const data = await ComfortTabModel.find().lean().exec();
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/modelcomfortabfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    // const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await ComfortTabModel.find({ status: "active" });

    const filteredData = datas?.map((data) => ({
      _id: data._id,
      image: data.image,
      selected_model: data.selected_model,
      status: data.status,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/status-update-modelcomfortab/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await ComfortTabModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Status updated", updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/status-modelcomfortab/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await ComfortTabModel.findById(id, "status");

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
