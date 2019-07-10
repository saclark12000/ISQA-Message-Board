var mongoose = require('mongoose');

var replySchema = new mongoose.Schema({
  text: { type: String, required: true },
  delete_password: { type: String, required: true, bcrypt: true },
  created_on: { type: Date, default: Date.now },
  reported : { type: Boolean, default: false }
});

var threadSchema = new mongoose.Schema({
  text: { type: String, required: true },
  delete_password: { type: String, required: true, bcrypt: true },
  board: {type: String, default: "general"},
  created_on: { type: Date, default: Date.now },
  bumped_on: { type: Date, default: Date.now },
  reported: { type: Boolean, default: false },
  replies: [ replySchema ]
});

threadSchema.plugin(require('mongoose-bcrypt'));
replySchema.plugin(require('mongoose-bcrypt'));

module.exports = mongoose.model("Thread", threadSchema);

// _id, text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), delete_password, & replies(array)
// 2019-06-25T00:00:00.000+00:00