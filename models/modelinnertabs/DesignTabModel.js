const mongoose = require("mongoose");

const DesignTabModelSchema = mongoose.Schema({
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
  color: { type: String, required: true },
  carImage: { type: String, required: true },
  selected_model: { type: String, required: true },
  status: { type: String, required: false, default: "active" },
});

const DesignTabModel = mongoose.model("ModelsDesignTab", DesignTabModelSchema);

module.exports = DesignTabModel;
