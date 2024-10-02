const mongoose = require("mongoose");

const AddDealerSchema = mongoose.Schema({
  dealerName: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  status: { type: String, required: false, default: "active" },
});

const AddDealer = mongoose.model("AddDealer", AddDealerSchema);

module.exports = AddDealer;
