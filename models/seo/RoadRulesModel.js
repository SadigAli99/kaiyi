const mongoose = require('mongoose');

const RoadRulesSchema = mongoose.Schema({
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

const RoadRulesModel = mongoose.model('roadruleseo', RoadRulesSchema);

module.exports = RoadRulesModel;
