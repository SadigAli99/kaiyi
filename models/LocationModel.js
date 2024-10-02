const mongoose = require("mongoose");

const LocationModelSchema = mongoose.Schema({
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
  icon: { type: String, required: true },
  status: { type: String, required: false, default: "active" },
});

const LocationModel = mongoose.model("location", LocationModelSchema);

module.exports = LocationModel;
