const express = require("express");
const router = express.Router();
const TelephoneModel = require("../models/TelephoneModel");
const upload = require("../config/MulterConfig");

router.post("/telephone", upload.single("img"), async (req, res) => {
  try {
    const imageFile = req.file ? `/public2/${req.file.filename}` : "";

    const requiredFields = ["title_az", "title_en", "title_ru", "telephone"];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `missing field ${field}` });
      }
    }

    const createData = new TelephoneModel({
      title: {
        az: req.body.title_az,
        en: req.body.title_en,
        ru: req.body.title_ru,
      },
      telephone: req.body.telephone,
      icon: imageFile,
      status: req.body.status
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/telephone/:id", upload.single("img"), async (req, res) => {
  try {
    const { id } = req.params;
    const imageFile = req.file ? `/public2/${req.file.filename}` : "";

    const { title_az, title_en, title_ru, telephone } = req.body;

    const updatedData = await TelephoneModel.findByIdAndUpdate(
      id,
      {
        $set: {
          title: {
            az: title_az,
            en: title_en,
            ru: title_ru,
          },
          telephone: telephone,
          icon: imageFile,
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

router.delete("/telephone/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await TelephoneModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: "data not found." });
    }

    await TelephoneModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted data" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/telephone", async (req, res) => {
  try {
    const data = await TelephoneModel.find();
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/telephonefront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await TelephoneModel.find({ status: "active" });

    const filteredData = datas?.map((data) => ({
      title: data.title[preferredLanguage],
      telephone: data.telephone,
      icon: data.icon,
      status: data.status,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});


router.post("/status-update-telephone/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await TelephoneModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Status updated", updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/status-telephone/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await TelephoneModel.findById(id, 'status');

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
