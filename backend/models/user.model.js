const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlenght: 3,
    },
    lastname: {
      type: String,
      required: true,
      minlenght: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlenght: 6,
    },
    groups: [
      {
        type: Schema.Types.ObjectId,
        ref: "groups",
      },
    ],
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "projects",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
