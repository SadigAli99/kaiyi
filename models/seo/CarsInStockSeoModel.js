const mongoose = require('mongoose');

const CarsInStockSeoSchema = mongoose.Schema({
  meta_title: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  meta_description: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
});

const CarsInStockSeoModel = mongoose.model('carsinstockseomodel', CarsInStockSeoSchema);

module.exports = CarsInStockSeoModel;
