const express = require("express");
const router = express.Router();
const KaiyiHistoryNewsModel = require("../../models/kaiyihistory/KaiyiHistoryNewsModel");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { uploadConfig, useSharp } = require("../../config/MulterC");
const slugify = require("slug");
const diskMountPath = require("../../config/mountPath");

router.post(
  "/kaiyi-history-news",
  uploadConfig.fields([
    { name: "img", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const imageFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imageOutputPath = path.join(diskMountPath, imageFileName);
      await useSharp(req.files.img[0].buffer, imageOutputPath);
      const imgFile = `/public/${imageFileName}`;

      if (!req.files.video) {
        return res.status(400).json({ message: "Video file is missing" });
      }

      const videoFileName = `${uuidv4()}-${Date.now()}-${req.files.video[0].originalname}`;
      const videoOutputPath = path.join(diskMountPath, videoFileName);

      const fs = require("fs");
      fs.writeFileSync(videoOutputPath, req.files.video[0].buffer);

      const videoFile = `/public/${videoFileName}`;

      const requiredFields = [
        "title_az",
        "title_en",
        "title_ru",
        "description_az",
        "description_en",
        "description_ru",
        "slogan_az",
        "slogan_en",
        "slogan_ru",
        "created_at",
        "hours",
      ];

      for (let field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ message: `missing field ${field}` });
        }
      }

      const slugAz = slugify(req.body.title_az, { lower: true });
      const slugEn = slugify(req.body.title_en, { lower: true });
      const slugRu = slugify(req.body.title_ru, { lower: true });

      const createData = new KaiyiHistoryNewsModel({
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
        slug: {
          az: slugAz,
          en: slugEn,
          ru: slugRu,
        },
        slogan: {
          az: req.body.slogan_az,
          en: req.body.slogan_en,
          ru: req.body.slogan_ru,
        },
        hours: req.body.hours,
        created_at: req.body.created_at,
        image: imgFile,
        video: videoFile,
        status: req.body.status,
      });

      const savedData = await createData.save();

      return res.status(200).json(savedData);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.put(
  "/kaiyi-history-news/:id",
  uploadConfig.fields([
    { name: "img", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;

      //image
      const fileName = `${uuidv4()}-${Date.now()}.webp`;
      const outputPath = path.join(diskMountPath, fileName);
      await useSharp(req.files.img[0].buffer, outputPath);
      const imgFile = `/public/${fileName}`;

      //video
      const videoFile = req.file ? `..//public/${req.files.video[0].filename}` : "";

      const {
        title_az,
        title_en,
        title_ru,
        description_az,
        description_en,
        description_ru,
        created_at,
        hours,
        slogan_az,
        slogan_en,
        slogan_ru,
      } = req.body;

      const updatedData = await KaiyiHistoryNewsModel.findByIdAndUpdate(
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
            slogan: {
              az: slogan_az,
              en: slogan_en,
              ru: slogan_ru,
            },
            created_at: created_at,
            hours: hours,
            image: imgFile,
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
  }
);

router.delete("/kaiyi-history-news/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await KaiyiHistoryNewsModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: "data not found." });
    }

    await KaiyiHistoryNewsModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted data" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/kaiyi-history-news", async (req, res) => {
  try {
    const data = await KaiyiHistoryNewsModel.find().lean().exec();
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/kaiyi-history-newsfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await KaiyiHistoryNewsModel.find({ status: "active" });

    const filteredData = datas?.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      slug: data.slug[preferredLanguage],
      slogan: data.slogan[preferredLanguage],
      video: data.video,
      image: data.image,
      created_at: data.created_at,
      hours: data.hours,
      status: data.status,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/status-update-kaiyi-history-news/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await KaiyiHistoryNewsModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Status updated", updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/status-kaiyi-history-news/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await KaiyiHistoryNewsModel.findById(id, "status");

    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json({ message: "Status fetched successfully", status: data.status });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/:lang/news/:slug", async (req, res) => {
  const { lang, slug } = req.params;
  const acceptLanguage = req.headers["accept-language"];
  const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];
  try {
    const slugField = `slug.${lang}`;

    const news = await KaiyiHistoryNewsModel.find({ [slugField]: slug });

    const filteredPrefLang = news.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      slug: data.slug[preferredLanguage],
      slogan: data.slogan[preferredLanguage],
      video: data.video,
      image: data.image,
      created_at: data.created_at,
      hours: data.hours,
      status: data.status,
    }));

    if (!news) return res.status(404).json({ message: "news not found" });

    return res.status(200).json(filteredPrefLang);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ err: error.message });
  }
});

module.exports = router;
