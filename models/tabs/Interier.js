const mongoose = require("mongoose");

const InterierModelSchema = mongoose.Schema({
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

const InterierModel = mongoose.model("InterierTab", InterierModelSchema);

module.exports = InterierModel;
