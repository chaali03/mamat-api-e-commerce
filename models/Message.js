const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Receiver is required']
  },
  content: {
    type: String,
    required: [true, 'Message content is required']
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  attachments: [{
    url: String,
    type: String,
    name: String
  }],
  readAt: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ createdAt: -1 });

// Populate sender and receiver when finding messages
messageSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'sender',
    select: 'name photo'
  }).populate({
    path: 'receiver',
    select: 'name photo'
  });
  next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;