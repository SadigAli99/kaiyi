const express = require('express');
const router = express.Router();
const AddCarModel = require('../../models/addcar/AddCarModel');
const { uploadConfig, useSharp } = require('../../config/MulterC');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const diskMountPath = require('../../config/mountPath');

router.post('/add-car', uploadConfig.single('img'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'image fields are required!' });
    }

    // Img
    const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
    const imgOutputPath = path.join(diskMountPath, imgFileName);
    await useSharp(req.file.buffer, imgOutputPath);
    const imageFile = `/public/${imgFileName}`;

    const requiredFields = ['titleAz', 'titleEn', 'titleRu', 'price', 'inStockAz', 'inStockEn', 'inStockRu', 'color'];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `missing field ${field}` });
      }
    }

    const existingVin = await AddCarModel.findOne({ vin: req.body.vin });

    if (existingVin) {
      return res.status(400).json({ message: 'is existing vin' });
    }

    const createData = new AddCarModel({
      title: {
        az: req.body.titleAz,
        en: req.body.titleEn,
        ru: req.body.titleRu,
      },
      inStock: {
        az: req.body.inStockAz,
        en: req.body.inStockEn,
        ru: req.body.inStockRu,
      },
      companyTitle: {
        az: req.body.companyTitleAz,
        en: req.body.companyTitleEn,
        ru: req.body.companyTitleRu,
      },
      miniDesc: {
        az: req.body.miniDescAz,
        en: req.body.miniDescEn,
        ru: req.body.miniDescRu,
      },
      color: req.body.color,
      year: req.body.year,
      price: req.body.price,
      vin: req.body.vin,
      carImage: imageFile,
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

router.put('/add-car/:id', uploadConfig.single('img'), async (req, res) => {
  try {
    const { id } = req.params;

    // Img
    const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
    const imgOutputPath = path.join(diskMountPath, imgFileName);
    await useSharp(req.file.buffer, imgOutputPath);
    const imageFile = `/public/${imgFileName}`;

    const {
      titleAz,
      titleEn,
      titleRu,
      price,
      inStockAz,
      inStockEn,
      inStockRu,
      companyTitleAz,
      companyTitleEn,
      companyTitleRu,
      miniDescAz,
      miniDescEn,
      miniDescRu,
      year,
      vin,
      color,
      selected_model,
    } = req.body;

    const updatedData = await AddCarModel.findByIdAndUpdate(
      id,
      {
        $set: {
          title: {
            az: titleAz,
            en: titleEn,
            ru: titleRu,
          },
          inStock: {
            az: inStockAz,
            en: inStockEn,
            ru: inStockRu,
          },
          companyTitle: {
            az: companyTitleAz,
            en: companyTitleEn,
            ru: companyTitleRu,
          },
          miniDesc: {
            az: miniDescAz,
            en: miniDescEn,
            ru: miniDescRu,
          },
          color: color,
          year: year,
          price: price,
          vin: vin,
          carImage: imageFile,
          selected_model: selected_model,
          status: req.body.status,
        },
      },
      { new: true },
    )
      .lean()
      .exec();

    if (!updatedData) {
      return res.status(404).json({ error: 'not found editid' });
    }

    return res.status(200).json(updatedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/add-car/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = await AddCarModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: 'data not found.' });
    }

    await AddCarModel.findByIdAndDelete(id);

    return res.status(200).json({ message: 'deleted data' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/add-car', async (req, res) => {
  try {
    const data = await AddCarModel.find();
    if (!data) {
      return res.status(404).json({ message: 'data not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/filter-cars', async (req, res) => {
  try {
    const acceptLanguage = req.headers['accept-language'] || 'az';
    const preferredLanguage = acceptLanguage.split(',')[0].split(';')[0];

    const { selected_model, color } = req.query;
    const modelFilter = selected_model ? selected_model.split(',') : [];

    const filter = { status: 'active' };

    if (modelFilter.length > 0) {
      filter.selected_model = { $in: modelFilter };
      filter.color = { $in: color };
    }

    const cars = await AddCarModel.find(filter);

    if (!cars || cars.length === 0) {
      return res.status(404).json({ error: 'No cars found with the selected filters.' });
    }

    const getLocalizedData = (field, lang) => {
      return field[lang] || field['en'] || field['az'] || 'N/A';
    };

    const filteredData = cars.map((data) => {
      return {
        _id: data._id,
        title: getLocalizedData(data.title, preferredLanguage),
        inStock: getLocalizedData(data.inStock, preferredLanguage),
        companyTitle: getLocalizedData(data.companyTitle, preferredLanguage),
        miniDesc: getLocalizedData(data.miniDesc, preferredLanguage),
        year: data.year,
        price: data.price,
        vin: data.vin,
        carImage: data.carImage,
        color: data.color,
        selected_model: data.selected_model,
        status: data.status,
      };
    });

    return res.status(200).json({ data: filteredData, dataCount: filteredData?.length });
  } catch (error) {
    console.error('Filter error:', error);
    return res.status(500).json({ error: 'Server Error' });
  }
});

router.post('/status-update-add-car/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await AddCarModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.status(200).json({ message: 'Status updated', updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/status-add-car/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const datas = await AddCarModel.findById(id, 'status');

    if (!datas) {
      return res.status(404).json({ message: 'data not found' });
    }

    return res.status(200).json({ message: 'Status fetched successfully', status: datas.status });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
