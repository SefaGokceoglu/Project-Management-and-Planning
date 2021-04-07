const router = require("express").Router();
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const GroupMessage = require("../models/group.message.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

router.get("/:group", auth, async (req, res) => {
  const currentUser = req.user;
  const groupID = req.params.group;
  const currentUserInfo = await User.findById(currentUser);
  if (!currentUserInfo.groups.includes(groupID)) {
    return res.status(200).json({ msg: "You are not in this group" });
  }

  const GroupMessages = await GroupMessage.find({ group: groupID }).sort({
    createdAt: 1,
  });
  res.status(200).json({ GroupMessages, currentUser });
});

router.post("/:group", auth, async (req, res) => {
  const currentUser = req.user;
  const groupID = req.params.group;
  const text = req.body.text;
  const io = req.io;

  const currentUserInfo = await User.findById(currentUser);

  if (!currentUserInfo.groups.includes(groupID)) {
    return res.status(200).json({ msg: "You are not in this group" });
  }
  const newGroupMessage = new GroupMessage({
    text,
    sendedBy: {
      UserID: currentUser,
      name: currentUserInfo.name,
      lastname: currentUserInfo.lastname,
    },
    group: groupID,
  });
  /*
  io.on("connection", function (socket) {
    socket.to(newGroupMessage.group).emit("NewMessage", newGroupMessage);
  });
  */
  await newGroupMessage.save();

  res.status(200).json(newGroupMessage);
});

module.exports = router;
