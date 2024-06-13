const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendeeSchema = new Schema({
  name: { type: String, required: true },
  email: String,
  number: String,
  party: { type: String, required: true },
  date: { type: String, required: true },
  votes: Array,
  matches: Array,
});

module.exports = mongoose.model('Attendee', attendeeSchema);
