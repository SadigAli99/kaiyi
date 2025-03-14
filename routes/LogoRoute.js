const express = require('express');
const router = express.Router();
const LogoModel = require('../models/LogoModel');
const upload = require('../config/MulterConfig');

router.post('/logo', upload.single('img'), async (req, res) => {
  try {
    const imageFile = req.file ? `/public/${req.file.filename}` : '';

    const createData = new LogoModel({
      logo: imageFile,
      status: req.body.status,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put('/logo/:id', upload.single('img'), async (req, res) => {
  try {
    const { id } = req.params;

    const existingData = await LogoModel.findById(id);

    if (!existingData) {
      return res.status(404).json({ message: 'Model not found by id' });
    }

    let updatedData = {
      status: req.body.status || existingData.status,
    };

    if (req.file) {
      const imageFile = `/public/${req.file.filename}`;
      updatedData.logo = imageFile;
    } else {
      updatedData.logo = existingData.logo;
    }

    const updated = await LogoModel.findByIdAndUpdate(id, { $set: updatedData }, { new: true, runValidators: true });

    if (!updated) {
      return res.status(400).json({ message: 'Failed to update the model' });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/logo/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = await LogoModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: 'Logo not found.' });
    }

    await LogoModel.findByIdAndDelete(id);

    return res.status(200).json({ message: 'deleted data' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/logo', async (req, res) => {
  try {
    const data = await LogoModel.find();
    if (!data) {
      return res.status(404).json({ message: 'data not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post('/status-update-logo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await LogoModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.status(200).json({ message: 'Status updated', updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});
router.get('/status-logo/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = await LogoModel.findById(id, 'status');

    if (!data) {
      return res.status(404).json({ message: 'data not found' });
    }

    return res.status(200).json({ message: 'Status fetched successfully', status: data.status });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

//get for front
router.get('/logo-front', async (req, res) => {
  try {
    const data = await LogoModel.find({ status: 'active' }).lean().exec();
    if (!data) {
      return res.status(404).json({ message: 'data not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
