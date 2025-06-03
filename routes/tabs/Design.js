const express = require('express');
const router = express.Router();
const DesignTabModel = require('../../models/tabs/Design');
const upload = require('../../config/MulterConfig');

router.post(
  '/designtab',
  upload.fields([
    { name: 'img', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const videoFile = req.files.video ? `/public/${req.files.video[0].filename}` : '';
      const imageFile = req.files.img ? `/public/${req.files.img[0].filename}` : '';

      const requiredFields = ['title_az', 'title_en', 'title_ru', 'description_az', 'description_en', 'description_ru', 'selected_option'];

      for (let field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ message: `missing field ${field}` });
        }
      }

      const createData = new DesignTabModel({
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
        video: videoFile,
        image: imageFile,
        selectedOption: req.body.selected_option,
        status: req.body.status,
      });

      const savedData = await createData.save();

      return res.status(200).json(savedData);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

router.put(
  '/designtab/:id',
  upload.fields([
    { name: 'img', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title_az, title_en, title_ru, description_az, description_en, description_ru, selected_option, status } = req.body;
      const existingData = await DesignTabModel.findById(id);

      if (!existingData) {
        return res.status(404).json({ message: 'Data not found' });
      }

      const updateFields = {
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
        selectedOption: selected_option,
        status: status,
        image: existingData.image,
        video: existingData.video,
      };

      if (req.files?.img) {
        updateFields.image = `/public/${req.files.img[0].filename}`;
      }

      if (req.files?.video) {
        updateFields.video = `/public/${req.files.video[0].filename}`;
      }

      const updatedData = await DesignTabModel.findByIdAndUpdate(id, { $set: updateFields }, { new: true }).lean();

      return res.status(200).json(updatedData);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

router.delete('/designtab/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = await DesignTabModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: 'data not found.' });
    }

    await DesignTabModel.findByIdAndDelete(id);

    return res.status(200).json({ message: 'deleted data' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/designtab', async (req, res) => {
  try {
    const data = await DesignTabModel.find();
    if (!data) {
      return res.status(404).json({ message: 'data not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/designtabfront', async (req, res) => {
  try {
    const acceptLanguage = req.headers['accept-language'];
    const preferredLanguage = acceptLanguage.split(',')[0].split(';')[0];

    const datas = await DesignTabModel.find({ status: 'active' });

    const filteredData = datas?.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      image: data.image,
      video: data.video,
      selectedOption: data.selectedOption,
      status: data.status,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post('/status-update-design/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await DesignTabModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.status(200).json({ message: 'Status updated', updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/status-design/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = await DesignTabModel.findById(id, 'status');

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
