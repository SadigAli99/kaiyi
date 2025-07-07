const express = require("express");
const router = express.Router();
const NewsTabModel = require("../../models/tabs/NewsTab");
const upload = require("../../config/MulterConfig");

router.post(
  "/newstab",
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const videoFile = req.files.video ? `/public/${req.files.video[0].filename}` : "";
      const imageFile = req.files.img ? `/public/${req.files.img[0].filename}` : "";

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

      const createData = new NewsTabModel({
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
  "/newstab/:id",
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const videoFile = req.files.video ? `/public/${req.files.video[0].filename}` : "";
      const image = req.files.img ? `/public/${req.files.img[0].filename}` : "";

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

      const updatedData = await NewsTabModel.findByIdAndUpdate(
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
            video: videoFile,
            image: image,
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

router.delete("/newstab/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await NewsTabModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: "data not found." });
    }

    await NewsTabModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted data" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/newstab", async (req, res) => {
  try {
    const data = await NewsTabModel.find();
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/newstabfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await NewsTabModel.find({ status: "active" });

    const filteredData = datas?.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      slogan: data.slogan[preferredLanguage],
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

router.post("/status-update-news/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await NewsTabModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Status updated", updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/status-news/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await NewsTabModel.findById(id, "status");

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
