const mongoose = require("mongoose");

const SecuritySchema = mongoose.Schema({
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

const SecurityModel = mongoose.model("SecurityTab", SecuritySchema);

module.exports = SecurityModel;
