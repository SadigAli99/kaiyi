const mongoose = require("mongoose");

const ForCCRegistersSchema = mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  telephone: { type: String, required: true },
  email: { type: String, required: true },
  companyName: { type: String, required: true },
  companyINN: { type: String, required: true },
  comment: { type: String, required: false },
  created_at: { type: String, required: true },
  hours: { type: String, required: true },
});

const ForCCRegisters = mongoose.model("ForCorporateCustomersRegistered", ForCCRegistersSchema);

module.exports = ForCCRegisters;
