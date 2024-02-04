const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email address is required.'],
    unique: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
      'This is not a valid email format.',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
  name: {
    type: String,
    unique: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  token: {
    type: String,
  },
  sid: {
    type: String,
  },
  online: {
    type: Boolean,
  },
  joinedRooms: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Room',
    },
  ],
  description: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('User', userSchema);
