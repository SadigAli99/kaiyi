const express = require('express');
const router = express.Router();
const GuarantAttentionModel = require('../../models/guarantkaiyi/GuarantAttentionModel');
const { uploadConfig } = require('../../config/MulterC');

router.post('/guarantattention', uploadConfig.none(), async (req, res) => {
  try {
    const requiredFields = ['description_az', 'description_en', 'description_ru'];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `missing field ${field}` });
      }
    }

    const createData = new GuarantAttentionModel({
      description: {
        az: req.body.description_az,
        en: req.body.description_en,
        ru: req.body.description_ru,
      },
      status: req.body.status,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put('/guarantattention/:id', uploadConfig.none(), async (req, res) => {
  try {
    const { id } = req.params;

    const { description_az, description_en, description_ru } = req.body;

    const updatedData = await GuarantAttentionModel.findByIdAndUpdate(
      id,
      {
        $set: {
          description: {
            az: description_az,
            en: description_en,
            ru: description_ru,
          },
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

router.delete('/guarantattention/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = await GuarantAttentionModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: 'data not found.' });
    }

    await GuarantAttentionModel.findByIdAndDelete(id);

    return res.status(200).json({ message: 'deleted data' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/guarantattention', async (req, res) => {
  try {
    const data = await GuarantAttentionModel.find().lean().exec();
    if (!data) {
      return res.status(404).json({ message: 'data not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/guarantattentionfront', async (req, res) => {
  try {
    const acceptLanguage = req.headers['accept-language'];
    const preferredLanguage = acceptLanguage.split(',')[0].split(';')[0];

    const datas = await GuarantAttentionModel.find({ status: 'active' });

    const filteredData = datas?.map((data) => ({
      _id: data._id,
      description: data.description[preferredLanguage],
      status: data.status,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post('/status-update-guarantattention/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await GuarantAttentionModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.status(200).json({ message: 'Status updated', updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/status-guarantattention/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = await GuarantAttentionModel.findById(id, 'status');

    if (!data) {
      return res.status(404).json({ message: 'data not found' });
    }

    return res.status(200).json({ message: 'Status fetched successfully', status: data.status });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
