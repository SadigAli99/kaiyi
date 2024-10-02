const mongoose = require("mongoose");

const NavContentSchema = mongoose.Schema({
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
  icon: { type: String, required: false, default: "" },
});

const OurAdvantagesModelSchema = mongoose.Schema({
  navTitle: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  content: [NavContentSchema],
  status: { type: String, required: false, default: "active" },
});

const OurAdvantagesModel = mongoose.model("OurAdvantages", OurAdvantagesModelSchema);

module.exports = OurAdvantagesModel;
