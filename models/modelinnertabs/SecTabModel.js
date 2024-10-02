const mongoose = require("mongoose");

const SecTabModelSchema = mongoose.Schema({
  title: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  description: {
     az: { type: String, required: true },
     en: { type: String, required: true },
     ru: { type: String, required: true },
  },
  image: { type: String, required: true },
  selected_model: { type: String, required: true },
  status: { type: String, required: false, default: "active" },
});

const SecTabModel = mongoose.model("ModelsSecTab", SecTabModelSchema);

module.exports = SecTabModel;
