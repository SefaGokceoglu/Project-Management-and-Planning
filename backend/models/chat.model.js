const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChatSchema = new Schema(
  {
    recipients: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users",
      },
    ],
    lastmessage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
