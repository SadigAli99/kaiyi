const mongoose = require('mongoose');

const DealerContactsServiceSchema = mongoose.Schema({
  serviceName: { type: String, required: true },
  cityName: { type: String, required: true },
  dealerCenter: { type: String, required: true },
  automobile: { type: String, required: true },
  name: { type: String, required: true },
  telephone: { type: String, required: true },
  email: { type: String, required: true },
  created_at: { type: String, required: true },
  hours: { type: String, required: true },
});

const DealerContactsServiceModel = mongoose.model('DealerContactsServiceUser', DealerContactsServiceSchema);

module.exports = DealerContactsServiceModel;
