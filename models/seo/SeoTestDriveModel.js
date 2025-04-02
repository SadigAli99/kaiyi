const mongoose = require('mongoose');

const SeoTestDriveSchema = mongoose.Schema({
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

const SeoTestDriveModel = mongoose.model('testdriveseo', SeoTestDriveSchema);

module.exports = SeoTestDriveModel;
