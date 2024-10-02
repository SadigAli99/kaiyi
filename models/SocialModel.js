const mongoose = require("mongoose");

const SocialModelSchema = mongoose.Schema({
  title: {
    az: {
      type: String,
      required: true,
    },
    en: {
      type: String,
      required: true,
    },
    ru: {
      type: String,
      required: true,
    },
  },
  link: { type: String, required: true },
  icon: { type: String, required: true },
  status: { type: String, required: false, default: "active" },
});

const SocialModel = mongoose.model("SocialMedia", SocialModelSchema);

module.exports = SocialModel;
