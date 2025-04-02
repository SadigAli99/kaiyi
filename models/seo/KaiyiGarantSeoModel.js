const mongoose = require('mongoose');

const KaiyiGarantSeoSchema = mongoose.Schema({
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

const KaiyiGarantSeoModel = mongoose.model('kaiyigarantseo', KaiyiGarantSeoSchema);

module.exports = KaiyiGarantSeoModel;
