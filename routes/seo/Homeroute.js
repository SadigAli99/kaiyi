const express = require('express');
const router = express.Router();
const HomeModel = require('../../models/seo/HomeModel');

router.post('/home-seo', async (req, res) => {
  try {
    const existingData = await HomeModel.findOne();

    if (!existingData) {
      const createData = new HomeModel({
        meta_title: {
          az: req.body.metaTitleAz,
          en: req.body.metaTitleEn,
          ru: req.body.metaTitleRu,
        },
        meta_description: {
          az: req.body.metaDescriptionAz,
          en: req.body.metaDescriptionEn,
          ru: req.body.metaDescriptionRu,
        },
      });

      await createData.save();
      return res.status(201).json({ message: 'created data' });
    }

    existingData.meta_title.az = req.body.metaTitleAz || existingData.meta_title.az;
    existingData.meta_title.en = req.body.metaTitleEn || existingData.meta_title.en;
    existingData.meta_title.ru = req.body.metaTitleRu || existingData.meta_title.ru;

    existingData.meta_description.az = req.body.metaDescriptionAz || existingData.meta_description.az;
    existingData.meta_description.en = req.body.metaDescriptionEn || existingData.meta_description.en;
    existingData.meta_description.ru = req.body.metaDescriptionRu || existingData.meta_description.ru;

    await existingData.save();

    return res.status(200).json({ message: 'updated data' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/home-seo', async (req, res) => {
  try {
    const data = await HomeModel.find();

    if (!data) {
      return res.status(404).json({ error: 'data not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
