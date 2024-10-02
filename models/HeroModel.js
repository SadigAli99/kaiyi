const mongoose = require("mongoose");

const HeroModelSchema = mongoose.Schema({
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
  miniImage: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, required: false, default: "active" },
});

const HeroModel = mongoose.model("heromodel", HeroModelSchema);

module.exports = HeroModel;
