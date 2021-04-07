const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GroupMessageSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    sendedBy: {
      UserID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users",
      },
      name: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "groups",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const GroupMessage = mongoose.model("GroupMessage", GroupMessageSchema);

module.exports = GroupMessage;
