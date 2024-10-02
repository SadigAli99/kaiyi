const mongoose = require("mongoose");

const InterierTabModelSchema = mongoose.Schema({
  title: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  modelTitle: {
     az: { type: String, required: true },
     en: { type: String, required: true },
     ru: { type: String, required: true },
  },
  image: { type: String, required: true },
  selected_model: { type: String, required: true },
  status: { type: String, required: false, default: "active" },
});

const InterierTabModel = mongoose.model("ModelsInterierTab", InterierTabModelSchema);

module.exports = InterierTabModel;
