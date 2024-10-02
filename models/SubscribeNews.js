const mongoose = require("mongoose");

const SubscribeNewsModelSchema = mongoose.Schema({
  email: { type: String, required: true },
  created_at: { type: String, required: true },
});

const SubscribeNewsModel = mongoose.model("SubscribeNewsEmail", SubscribeNewsModelSchema);

module.exports = SubscribeNewsModel;