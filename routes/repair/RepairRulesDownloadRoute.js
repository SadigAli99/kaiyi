const express = require("express");
const router = express.Router();
const RepairRulesDownloadModel = require("../../models/repair/RepairRulesDownloadModel");
const { uploadConfig, useSharp } = require("../../config/MulterC");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const diskMountPath = require('../../config/mountPath');

router.post(
  "/repair-rules-download",
  uploadConfig.fields([
    { name: "pdf", maxCount: 10 },
    { name: "img", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const requiredFields = ["title_az", "title_en", "title_ru"];

      for (field of requiredFields) {
        if (!req.body[field]) {
          return res.status(404).json({ message: `Missing field ${field}` });
        }
      }

      let pdfFile = "";
      if (req.files.pdf) {
        const pdfFileName = `${uuidv4()}-${Date.now()}-${req.files.pdf[0].originalname}`;
        const pdfOutputPath = path.join(diskMountPath, pdfFileName);

        fs.writeFileSync(pdfOutputPath, req.files.pdf[0].buffer);

        pdfFile = `/public/${pdfFileName}`;
      }

      const imgFileName = `${uuidv4()}${Date.now()}.webp`;
      const outputPath = path.join(diskMountPath, imgFileName);
      await useSharp(req.files["img"] ? req.files["img"][0].buffer : "", outputPath);
      const imgFile = `/public/${imgFileName}`;

      const save = new RepairRulesDownloadModel({
        title: {
          az: req.body.title_az,
          en: req.body.title_en,
          ru: req.body.title_ru,
        },
        pdfs: pdfFile,
        image: imgFile,
      });

      const saved = await save.save();

      return res.status(200).json(saved);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.put(
  "/repair-rules-download/:id",
  uploadConfig.fields([
    { name: "pdf", maxCount: 10 },
    { name: "img", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const fileName = `${uuidv4()}-${Date.now()}.webp`;
      const outputPath = path.join(diskMountPath, fileName);
      await useSharp(req.files.img[0].buffer, outputPath);
      const imgFile = `/public/${fileName}`;

      let pdfFile = "";
      if (req.files.pdf) {
        const pdfFileName = `${uuidv4()}-${Date.now()}-${req.files.pdf[0].originalname}`;
        const pdfOutputPath = path.join(diskMountPath, pdfFileName);

        fs.writeFileSync(pdfOutputPath, req.files.pdf[0].buffer);

        pdfFile = `/public/${pdfFileName}`;
      }

      const { title_az, title_en, title_ru } = req.body;

      const updatedData = await RepairRulesDownloadModel.findByIdAndUpdate(
        id,
        {
          $set: {
            title: {
              az: title_az,
              en: title_en,
              ru: title_ru,
            },
            pdfs: pdfFile,
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
  }
);

router.delete("/repair-rules-download/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await RepairRulesDownloadModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: "data not found." });
    }

    await RepairRulesDownloadModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted data" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/repair-rules-download", async (req, res) => {
  try {
    const data = await RepairRulesDownloadModel.find().lean().exec();
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/repair-rulesdownloadfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await RepairRulesDownloadModel.find({ status: "active" });

    const filteredData = datas?.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      pdfs: data.pdfs,
      image: data.image,
      status: data.status,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/status-update-repair-rules-download/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await RepairRulesDownloadModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Status updated", updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/status-repair-rules-download/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await RepairRulesDownloadModel.findById(id, "status");

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
