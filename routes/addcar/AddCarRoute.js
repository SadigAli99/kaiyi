const express = require('express');
const router = express.Router();
const AddCarModel = require('../../models/addcar/AddCarModel');
const { uploadConfig, useSharp } = require('../../config/MulterC');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const diskMountPath = require('../../config/mountPath');

router.post('/add-car', uploadConfig.single('img'), async (req, res) => {
  try {
    let imageFile = '';

    if (req.file && req.file.buffer) {
      const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imgOutputPath = path.join(diskMountPath, imgFileName);
      await useSharp(req.file.buffer, imgOutputPath);
      imageFile = `/public2/${imgFileName}`;
    }

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
    const car = await AddCarModel.findById(id);
    if (!car) return res.status(404).json({ error: 'Car not found' });

    let imageFile;

    if (req.file && req.file.buffer) {
      const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imgOutputPath = path.join(diskMountPath, imgFileName);
      await useSharp(req.file.buffer, imgOutputPath);
      imageFile = `/public2/${imgFileName}`;
    } else {
      imageFile = car.carImage;
    }

    const updatedFields = {
      title: {
        az: req.body.titleAz ?? car.title.az,
        en: req.body.titleEn ?? car.title.en,
        ru: req.body.titleRu ?? car.title.ru,
      },
      inStock: {
        az: req.body.inStockAz ?? car.inStock.az,
        en: req.body.inStockEn ?? car.inStock.en,
        ru: req.body.inStockRu ?? car.inStock.ru,
      },
      companyTitle: {
        az: req.body.companyTitleAz ?? car.companyTitle.az,
        en: req.body.companyTitleEn ?? car.companyTitle.en,
        ru: req.body.companyTitleRu ?? car.companyTitle.ru,
      },
      miniDesc: {
        az: req.body.miniDescAz ?? car.miniDesc.az,
        en: req.body.miniDescEn ?? car.miniDesc.en,
        ru: req.body.miniDescRu ?? car.miniDesc.ru,
      },
      color: req.body.color ?? car.color,
      year: req.body.year ?? car.year,
      price: req.body.price ?? car.price,
      vin: req.body.vin ?? car.vin,
      carImage: imageFile,
      selected_model: req.body.selected_model ?? car.selected_model,
      status: req.body.status ?? car.status,
    };

    const updatedCar = await AddCarModel.findByIdAndUpdate(id, { $set: updatedFields }, { new: true }).lean().exec();
    return res.status(200).json(updatedCar);
  } catch (error) {
    console.error(error);
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
    const modelColor = color ? `#${color}` : null;

    const filter = { status: 'active' };

    if (modelFilter.length > 0) {
      filter.selected_model = { $in: modelFilter };
    }

    if (modelColor) {
      filter.color = modelColor;
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
