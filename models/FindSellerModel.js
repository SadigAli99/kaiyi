const mongoose = require("mongoose");

const InformationsSchema = mongoose.Schema({
  title: {
    az: { type: String, required: false, default: "" },
    en: { type: String, required: false, default: "" },
    ru: { type: String, required: false, default: "" },
  },
  value: {
    az: { type: String, required: false, default: "" },
    en: { type: String, required: false, default: "" },
    ru: { type: String, required: false, default: "" },
  },
});

const OtherServicesSchema = mongoose.Schema({
  serviceIcon: { type: String, required: false, default: "" },
  serviceName: {
    az: { type: String, required: false, default: "" },
    en: { type: String, required: false, default: "" },
    ru: { type: String, required: false, default: "" },
  },
});

const CitySchema = mongoose.Schema({
  cityName: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  informations: [InformationsSchema],
  otherServices: [OtherServicesSchema],
  websiteLink: { type: String, required: false, default: "" },
  status: { type: String, required: false, default: "active" },
});

const CityModel = mongoose.model("city_model", CitySchema);

module.exports = CityModel;
