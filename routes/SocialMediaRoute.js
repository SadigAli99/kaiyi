const express = require("express");
const router = express.Router();
const SocialMediaModel = require("../models/SocialModel");
const upload = require("../config/MulterConfig");

router.post("/add-socials", upload.single("img"), async (req, res) => {
  try {
    const imageFile = req.file ? `/public2/${req.file.filename}` : "";

    const requiredFields = ["title_az", "title_en", "title_ru", "link"];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `missing field ${field}` });
      }
    }

    const createData = new SocialMediaModel({
      title: {
        az: req.body.title_az,
        en: req.body.title_en,
        ru: req.body.title_ru,
      },
      link: req.body.link,
      icon: imageFile,
      status: req.body.status,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/add-socials/:id", upload.single("img"), async (req, res) => {
  try {
    const { id } = req.params;
    const imageFile = req.file ? `/public2/${req.file.filename}` : "";

    const { title_az, title_en, title_ru, link } = req.body;

    const updatedData = await SocialMediaModel.findByIdAndUpdate(
      id,
      {
        $set: {
          title: {
            az: title_az,
            en: title_en,
            ru: title_ru,
          },
          link: link,
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

router.delete("/add-socials/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await SocialMediaModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: "data not found." });
    }

    await SocialMediaModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted data" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/add-socials", async (req, res) => {
  try {
    const data = await SocialMediaModel.find();
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/social-media-front", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await SocialMediaModel.find({ status: "active" });

    const filteredData = datas?.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      link: data.link,
      icon: data.icon,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/status-update-add-socials/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await SocialMediaModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Status updated", updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/status-add-socials/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await SocialMediaModel.findById(id, "status");

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
