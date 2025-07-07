const express = require("express");
const router = express.Router();
const VideoTabModel = require("../../models/modelinnertabs/VideoTabModel");
const upload = require("../../config/MulterConfig");

router.post("/modelvideotab", upload.single("video"), async (req, res) => {
  try {
    const videoFile = req.file ? `/public2/${req.file.filename}` : "";

    const requiredFields = ["title_az", "title_en", "title_ru", "selected_model"];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `missing field ${field}` });
      }
    }

    const createData = new VideoTabModel({
      title: {
        az: req.body.title_az,
        en: req.body.title_en,
        ru: req.body.title_ru,
      },
      selected_model: req.body.selected_model,
      video: videoFile,
      status: req.body.status,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/modelvideotab/:id", upload.single("video"), async (req, res) => {
  try {
    const { id } = req.params;
    const videoFile = req.file ? `/public2/${req.file.filename}` : "";

    const { title_az, title_en, title_ru, selected_model } = req.body;

    const updatedData = await VideoTabModel.findByIdAndUpdate(
      id,
      {
        $set: {
          title: {
            az: title_az,
            en: title_en,
            ru: title_ru,
          },
          selected_model: selected_model,
          video: videoFile,
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

router.delete("/modelvideotab/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await VideoTabModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: "data not found." });
    }

    await VideoTabModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted data" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/modelvideotab", async (req, res) => {
  try {
    const data = await VideoTabModel.find();
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/modelvideotabfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await VideoTabModel.find({ status: "active" });
   
    const filteredData = datas?.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      selected_model: data.selected_model,
      video: data.video,
      status: data.status,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/status-update-modelvideotab/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await VideoTabModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Status updated", updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/status-modelvideotab/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await VideoTabModel.findById(id, "status");

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
