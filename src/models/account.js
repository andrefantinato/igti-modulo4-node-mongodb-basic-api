var mongoose = require('mongoose');

var accountSchema = mongoose.Schema({
  agencia: {
    required: true,
    type: Number,
  },
  conta: {
    require: true,
    type: Number,
  },
  name: {
    required: true,
    type: String,
  },
  balance: {
    required: true,
    type: Number,
    min: 0,
  },
});

module.exports = mongoose.model('account', accountSchema);
