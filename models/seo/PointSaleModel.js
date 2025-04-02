const mongoose = require('mongoose');

const PointSaleSchema = mongoose.Schema({
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

const PointSaleModel = mongoose.model('pointsaleseo', PointSaleSchema);

module.exports = PointSaleModel;
