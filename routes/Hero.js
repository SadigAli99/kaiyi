const express = require('express');
const router = express.Router();
const HeroModel = require('../models/HeroModel');
const { uploadConfig, useSharp } = require('../config/MulterC');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const diskMountPath = require('../config/mountPath');
router.post(
  '/hero',
  uploadConfig.fields([
    { name: 'img', maxCount: 1 },
    { name: 'miniImg', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files.img || !req.files.miniImg) {
        return res.status(400).json({ msg: 'Both image fields are required!' });
      }

      // Img
      const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imgOutputPath = path.join(diskMountPath, imgFileName);
      await useSharp(req.files.img[0].buffer, imgOutputPath);
      const imageFile = `/public/${imgFileName}`;

      // Mini img
      const miniImgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const miniImgOutputPath = path.join(diskMountPath, miniImgFileName);
      await useSharp(req.files.miniImg[0].buffer, miniImgOutputPath);
      const miniImgFile = `/public/${miniImgFileName}`;

      const requiredFields = ['title_az', 'title_en', 'title_ru', 'description_az', 'description_en', 'description_ru'];

      for (let field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ message: `missing field ${field}` });
        }
      }

      const createData = new HeroModel({
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
        miniImage: miniImgFile,
        image: imageFile,
        status: req.body.status,
      });

      const savedData = await createData.save();

      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();

      const message = `deleted${hours}:${minutes} ${day}.${month}.${year}`;

      return res.status(200).json({ message, savedData });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

router.put(
  '/hero/:id',
  uploadConfig.fields([
    { name: 'img', maxCount: 1 },
    { name: 'miniImg', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;

      const existingHero = await HeroModel.findById(id);
      if (!existingHero) {
        return res.status(404).json({ error: 'Güncellenecek veri bulunamadı!' });
      }

      const updatedData = {
        title: {
          az: title_az || existingHero.title.az,
          en: title_en || existingHero.title.en,
          ru: title_ru || existingHero.title.ru,
        },
        description: {
          az: description_az || existingHero.description.az,
          en: description_en || existingHero.description.en,
          ru: description_ru || existingHero.description.ru,
        },
      };

      if (req.files['img']) {
        const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
        const imgOutputPath = `/public/${imgFileName}`;
        await uploadConfig.single('img')(req, res, async function (err) {
          if (err) throw new Error('UP err.');
          await uploadConfig.fields([{ name: 'img', maxCount: 1 }])(req, res, async function (err) {
            if (err) throw err;
          });
          updatedData.imageFile = imgOutputPath;
        });
      } else {
        updatedData.imageFile = existingHero.image;
      }

      if (req.files['miniImg']) {
        const miniImgFileName = `${uuidv4()}-${Date.now()}-mini.webp`;
        const miniImgOutputPath = `/public/${miniImgFileName}`;
        await uploadConfig.single('miniImg')(req, res, async function (err) {
          if (err) throw new Error('Mini UP Err.');
        });
        updatedData.miniImage = miniImgOutputPath;
      } else {
        updatedData.miniImage = existingHero.miniImage;
      }

      const updatedHero = await HeroModel.findByIdAndUpdate(id, { $set: updatedData }, { new: true, runValidators: true });

      return res.status(200).json(updatedHero);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

router.delete('/hero/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = await HeroModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: 'data not found.' });
    }

    await HeroModel.findByIdAndDelete(id);

    return res.status(200).json({ message: 'deleted data' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/hero', async (req, res) => {
  try {
    const data = await HeroModel.find();
    if (!data) {
      return res.status(404).json({ message: 'data not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/herofront', async (req, res) => {
  try {
    const acceptLanguage = req.headers['accept-language'];
    const preferredLanguage = acceptLanguage.split(',')[0].split(';')[0];

    const datas = await HeroModel.find({ status: 'active' });

    const filteredData = datas?.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      image: data.image,
      miniImage: data.miniImage,
      status: data.status,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post('/status-update-hero/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await HeroModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.status(200).json({ message: 'Status updated', updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});
router.get('/status-hero/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const hero = await HeroModel.findById(id, 'status');

    if (!hero) {
      return res.status(404).json({ message: 'Hero not found' });
    }

    return res.status(200).json({ message: 'Status fetched successfully', status: hero.status });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
