const express = require('express');
const router = express.Router();
const CarsInStockSeoModel = require('../../models/seo/CarsInStockSeoModel');

router.post('/stockincars-seo', async (req, res) => {
  try {
    const existingData = await CarsInStockSeoModel.findOne();

    if (!existingData) {
      const createData = new CarsInStockSeoModel({
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

router.get('/stockincars-seo', async (req, res) => {
  try {
    const data = await CarsInStockSeoModel.find();

    if (!data) {
      return res.status(500).json({ error: 'not found data' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/stockincars-seo-front', async (req, res) => {
  try {
    const acceptLanguage = req.headers['accept-language'];
    const preferredLanguage = acceptLanguage.split(',')[0].split(';')[0];

    const datas = await CarsInStockSeoModel.find();

    const filteredData = datas?.map((data) => ({
      _id: data._id,
      meta_title: data.meta_title[preferredLanguage],
      meta_description: data.meta_description[preferredLanguage],
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
