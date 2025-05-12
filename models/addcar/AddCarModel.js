const mongoose = require("mongoose");

const AddCarSchema = mongoose.Schema({
  title: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  inStock: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  companyTitle: {
    az: { type: String, required: false, default: "" },
    en: { type: String, required: false, default: "" },
    ru: { type: String, required: false, default: "" },
  },
  miniDesc: {
    az: { type: String, required: false, default: "" },
    en: { type: String, required: false, default: "" },
    ru: { type: String, required: false, default: "" },
  },
  year: { type: String, required: false, default: "" },
  vin: { type: String, required: true, unique: true },
  price: { type: String, required: true },
  carImage: { type: String, required: true },
  selected_model: { type: String, required: true },
  color: { type: String, required: true, unique: false },
  status: { type: String, required: false, default: "active" },
});

const AddCar = mongoose.model("AddedCar", AddCarSchema);

module.exports = AddCar;
