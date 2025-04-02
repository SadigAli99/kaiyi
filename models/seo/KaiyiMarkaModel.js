const mongoose = require('mongoose');

const KaiyiMarkaSchema = mongoose.Schema({
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

const KaiyiMarkaModel = mongoose.model('kaiyimarkaseo', KaiyiMarkaSchema);

module.exports = KaiyiMarkaModel;
