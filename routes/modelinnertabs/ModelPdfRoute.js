const express = require("express");
const router = express.Router();
const ModelPdf = require("../../models/modelinnertabs/PdfModel");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const upload = require("../../config/MulterConfig");

router.post("/modelpdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "image field is required!" });
    }

    const pdfFile = req.file ? `/public/${req.file.filename}` : "";

    const requiredFields = ["selected_model"];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `missing field ${field}` });
      }
    }

    const createData = new ModelPdf({
      pdf: pdfFile,
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

router.put("/modelpdf/:id", upload.single("pdf"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ msg: "image field is required!" });
    }

    const pdfFile = req.file ? `/public/${req.file.filename}` : "";

    const { selected_model } = req.body;

    const updatedData = await ModelPdf.findByIdAndUpdate(
      id,
      {
        $set: {
          pdf: pdfFile,
          selected_model: selected_model,
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

router.delete("/modelpdf/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await ModelPdf.findById(id);

    if (!data) {
      return res.status(404).json({ message: "data not found." });
    }

    await ModelPdf.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted data" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/modelpdf", async (req, res) => {
  try {
    const data = await ModelPdf.find().lean().exec();
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/modelpdf-front", async (req, res) => {
  try {
    const datas = await ModelPdf.find({ status: "active" });

    const filteredData = datas?.map((data) => ({
      _id: data._id,
      pdf: data.pdf,
      selected_model: data.selected_model,
      status: data.status,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/status-update-modelpdf/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await ModelPdf.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Status updated", updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/status-modelpdf/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await ModelPdf.findById(id, "status");

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
