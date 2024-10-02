const mongoose = require("mongoose");

const ViewModelSchema = mongoose.Schema({
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
  video: { type: String, required: false, default: "" },
  image: { type: String, required: true, default: "" },
  selectedOption: { type: String, required: true, default: "" },
  status: { type: String, required: false, default: "active" },
});

const ViewModel = mongoose.model("ViewTab", ViewModelSchema);

module.exports = ViewModel;
