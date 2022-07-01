const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  eventName: String,
  eventLocation: String,
  eventDetails: String,
  eventDate: String,
  price: Number
})

module.exports.Event = mongoose.model('Event', eventSchema)