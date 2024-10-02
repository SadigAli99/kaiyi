const express = require("express");
const router = express.Router();
const OurAdvantagesModel = require("../models/OurAdvantagesModel");
const { uploadConfig, useSharp } = require("../config/MulterC");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const diskMountPath = require("../config/mountPath");

router.post("/ouradvantages", uploadConfig.array("icon", 10), async (req, res) => {
  try {
    const requiredFields = ["navTitleAz", "navTitleEn", "navTitleRu"];
    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `missing field ${field}` });
      }
    }

    const fileNames = [];
    if (req.files) {
      for (let file of req.files) {
        const fileName = `${uuidv4()}-${Date.now()}.webp`;
        const outputPath = path.join(diskMountPath, fileName);
        await useSharp(file.buffer, outputPath);
        fileNames.push(`/public/${fileName}`);
      }
    }

    const contentData = req.body.content
      ? req.body.content.map((content, index) => {
          return {
            title: {
              az: content.titleAz,
              en: content.titleEn,
              ru: content.titleRu,
            },
            description: {
              az: content.descriptionAz,
              en: content.descriptionEn,
              ru: content.descriptionRu,
            },
            icon: fileNames[index] || "",
          };
        })
      : null;

    const savedData = new OurAdvantagesModel({
      navTitle: {
        az: req.body.navTitleAz,
        en: req.body.navTitleEn,
        ru: req.body.navTitleRu,
      },
      content: contentData,
      status: req.body.status,
    });

    const saved = await savedData.save();

    return res.status(200).json(saved);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/ouradvantages/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await OurAdvantagesModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: "data not found." });
    }

    await OurAdvantagesModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted data" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/ouradvantages/:id", uploadConfig.array("icon", 10), async (req, res) => {
  try {
    const { id } = req.params;

    const { navTitleAz, navTitleEn, navTitleRu } = req.body;

    const fileNames = [];
    if (req.files) {
      for (let file of req.files) {
        const fileName = `${uuidv4()}-${Date.now()}.webp`;
        const outputPath = path.join(diskMountPath, fileName);
        await useSharp(file.buffer, outputPath);
        fileNames.push(`/public/${fileName}`);
      }
    }

    const contentData = req.body.content
      ? req.body.content.map((content, index) => {
          return {
            title: {
              az: content.titleAz,
              en: content.titleEn,
              ru: content.titleRu,
            },
            description: {
              az: content.descriptionAz,
              en: content.descriptionEn,
              ru: content.descriptionRu,
            },
            icon: fileNames[index] || "",
          };
        })
      : null;

    const updatedData = await OurAdvantagesModel.findByIdAndUpdate(
      id,
      {
        $set: {
          navTitle: {
            az: navTitleAz,
            en: navTitleEn,
            ru: navTitleRu,
          },
          content: contentData,
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

router.get("/ouradvantages", async (req, res) => {
  try {
    const data = await OurAdvantagesModel.find();
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/ouradvantagesfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await OurAdvantagesModel.find({ status: "active" });

    const filteredData = datas?.map((data) => ({
      _id: data._id,
      navTitle: data.navTitle[preferredLanguage],
      content:
        data.content &&
        data.content?.map((content) => ({
          title: content?.title[preferredLanguage],
          description: content?.description[preferredLanguage],
          icon: content?.icon,
        })),
      status: data.status,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/status-update-ouradvantages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await OurAdvantagesModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Status updated", updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});
router.get("/status-ouradvantages/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const ouradvantages = await OurAdvantagesModel.findById(id, "status");

    if (!ouradvantages) {
      return res.status(404).json({ message: "ouradvantages not found" });
    }

    return res.status(200).json({ message: "Status fetched successfully", status: ouradvantages.status });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
