const mongoose = require("mongoose");

const TelephoneModelSchema = mongoose.Schema({
  title: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  telephone: { type: Number, required: true },
  icon: { type: String, required: true },
  status: { type: String, required: false, default: "active" },
});

const TelephoneModel = mongoose.model("telephone", TelephoneModelSchema);

module.exports = TelephoneModel;