const mongoose = require("mongoose");

const LogoModelSchema = mongoose.Schema({
  logo: { type: String, required: true },
  status: { type: String, required: false, default: "active" },
});

const LogoModel = mongoose.model("logo", LogoModelSchema);

module.exports = LogoModel;
