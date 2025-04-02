const mongoose = require('mongoose');

const NewSeoSchema = mongoose.Schema({
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

const NewSeoModel = mongoose.model('newseo', NewSeoSchema);

module.exports = NewSeoModel;
