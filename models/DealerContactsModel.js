const mongoose = require("mongoose");

const DealerContactsSchema = mongoose.Schema({
  city: { type: String, required: true },
  dealerCenter: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  telephone: { type: String, required: true },
  email: { type: String, required: true },
  created_at: { type: String, required: true },
  hours: { type: String, required: true },
});

const DealerContacts = mongoose.model("DealerContactsUser", DealerContactsSchema);

module.exports = DealerContacts;
