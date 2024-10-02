const mongoose = require("mongoose");

const GuarantKaiyiDescriptionSchema = mongoose.Schema({
  title: {
    az: { type: String, required: false, default: "" },
    en: { type: String, required: false, default: "" },
    ru: { type: String, required: false, default: "" },
  },
  description: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  image: { type: String, required: true },
  status: { type: String, required: false, default: "active" },
});

const GuarantKaiyiDescription = mongoose.model("GuarantKaiyiDescription", GuarantKaiyiDescriptionSchema);

module.exports = GuarantKaiyiDescription;
