const express = require("express");
const router = express.Router();
const ModelsTabModel = require("../../models/tabs/ModelsTab");
const upload = require("../../config/MulterConfig");
const createSlug = require("../../config/createSlug");
const { uploadConfig, useSharp } = require("../../config/MulterC");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

router.post(
  "/modelstab",
  uploadConfig.fields([
    { name: "img", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Img
      const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imgOutputPath = path.join(__dirname, "../public", imgFileName);
      await useSharp(req.files.img[0].buffer, imgOutputPath);
      const imageFile = `/public/${imgFileName}`;

      // Video handling
      let videoFile = "";
      if (req.files.video) {
        const videoFileName = `${uuidv4()}-${Date.now()}-${req.files.video[0].originalname}`;
        const videoOutputPath = path.join(__dirname, "../../public", videoFileName);

        fs.writeFileSync(videoOutputPath, req.files.video[0].buffer);

        videoFile = `/public/${videoFileName}`;
      }
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
      ];

      for (let field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ message: `missing field ${field}` });
        }
      }

      const createData = new ModelsTabModel({
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
        slogan: {
          az: req.body.slogan_az,
          en: req.body.slogan_en,
          ru: req.body.slogan_ru,
        },
        video: videoFile,
        image: imageFile,
        slug: {
          az: createSlug(req.body.title_az),
          en: createSlug(req.body.title_en),
          ru: createSlug(req.body.title_ru),
        },
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
  "/modelstab/:id",
  uploadConfig.fields([
    { name: "img", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Img
      const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imgOutputPath = path.join(__dirname, "../../public", imgFileName);
      await useSharp(req.files.img[0].buffer, imgOutputPath);
      const imageFile = `/public/${imgFileName}`;

      // Video handling
      let videoFile = "";
      if (req.files.video) {
        const videoFileName = `${uuidv4()}-${Date.now()}-${req.files.video[0].originalname}`;
        const videoOutputPath = path.join(__dirname, "../../public", videoFileName);

        fs.writeFileSync(videoOutputPath, req.files.video[0].buffer);

        videoFile = `/public/${videoFileName}`;
      }
      const {
        title_az,
        title_en,
        title_ru,
        description_az,
        description_en,
        description_ru,
        slogan_az,
        slogan_en,
        slogan_ru,
      } = req.body;

      const updatedData = await ModelsTabModel.findByIdAndUpdate(
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
            slug: {
              az: createSlug(req.body.title_az),
              en: createSlug(req.body.title_en),
              ru: createSlug(req.body.title_ru),
            },
            video: videoFile,
            image: imageFile,
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

router.delete("/modelstab/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await ModelsTabModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: "data not found." });
    }

    await ModelsTabModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted data" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/modelstab", async (req, res) => {
  try {
    const data = await ModelsTabModel.find();
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/modelstabfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await ModelsTabModel.find({ status: "active" });

    const filteredData = datas?.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      slogan: data.slogan[preferredLanguage],
      slug: data.slug[preferredLanguage],
      image: data.image,
      video: data.video,
      status: data.status,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/status-update-models/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await ModelsTabModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Status updated", updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/status-models/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await ModelsTabModel.findById(id, "status");

    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json({ message: "Status fetched successfully", status: data.status });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/modelstab/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const data = await ModelsTabModel.findOne({ [`slug.${preferredLanguage}`]: slug, status: "active" });
    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }

    const responseData = {
      _id: data._id,
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      slogan: data.slogan[preferredLanguage],
      slug: data.slug[preferredLanguage],
      image: data.image,
      video: data.video,
      status: data.status,
    };

    return res.status(200).json(Array(responseData));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
