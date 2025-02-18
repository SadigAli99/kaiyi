const express = require('express');
const router = express.Router();
const DealerContactsServiceModel = require('../models/DealerContactServiceModel');

router.post('/dealer-contacts-service', async (req, res) => {
  try {
    const requiredFields = ['serviceName', 'cityName', 'dealerCenter', 'automobile', 'hours', 'created_at', 'name', 'telephone', 'email'];

    for (field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `missing field ${field}` });
      }
    }

    const saveRegisters = new DealerContactsServiceModel({
      serviceName: req.body.serviceName,
      cityName: req.body.cityName,
      dealerCenter: req.body.dealerCenter,
      automobile: req.body.automobile,
      name: req.body.name,
      telephone: req.body.telephone,
      email: req.body.email,
      created_at: req.body.created_at,
      hours: req.body.hours,
    });

    const savedData = await saveRegisters.save();

    return res.status(200).json(savedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.get('/dealer-contacts-service', async (req, res) => {
  try {
    const findRequestsUsers = await DealerContactsServiceModel.find().lean().exec();

    if (!findRequestsUsers) {
      return res.status(404).json({ message: 'data not found or other problem' });
    }

    return res.status(200).json(findRequestsUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
