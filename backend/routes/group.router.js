const router = require("express").Router();
const Chat = require("../models/chat.model");
const Group = require("../models/group.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const currentUser = req.user;

  const currentUserInfo = await User.findById(currentUser);
  const UserGroupID = currentUserInfo.groups;

  const UserGroups = await Group.find({
    _id: { $in: UserGroupID },
    createdBy: { $nin: currentUser },
  });
  const CreatedGroups = await Group.find({
    _id: { $in: UserGroupID },
    createdBy: currentUser,
  });
  const AllGroups = await Group.find({
    _id: { $nin: UserGroupID },
    private: false,
  });
  res.status(200).json({ UserGroups, CreatedGroups, AllGroups });
});

router.get("/chats", auth, async (req, res) => {
  const currentUser = req.user;

  const PrivateChats = await Chat.find({ recipients: { $in: [currentUser] } });

  const Chats = await Promise.all(
    PrivateChats.map(async (chat) => {
      const sended = chat.recipients.filter((user) => user != currentUser);
      const sendedToUser = await User.findById(sended[0]);
      return {
        chat,
        sendedTo: {
          name: sendedToUser.name,
          lastname: sendedToUser.lastname,
          _id: sendedToUser._id,
        },
      };
    })
  );
  console.log(Chats);
  res.status(200).json(Chats);
});
router.post("/create", auth, async (req, res) => {
  const { name, private } = req.body;
  const userID = req.user;

  if (name.length < 1) {
    return res.status(400).json({ msg: "Please enter room name !" });
  }

  const newGroup = new Group({
    name,
    createdBy: userID,
    private,
  });

  const savedGroup = await newGroup.save();

  const Creator = await User.findById(userID);
  const Groups = [...Creator.groups, savedGroup._id];
  await User.findByIdAndUpdate(userID, { groups: Groups });

  res.json(savedGroup);
});

router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const userID = req.user;
  const deletedGroup = await Group.findById(id);
  if (deletedGroup.createdBy != userID) {
    return res.status(400).json({ msg: "You can not delete this Group !" });
  }
  await Group.findByIdAndDelete(id);
  const Users = await User.find({ groups: id });
  Users.forEach((user) => {
    user.groups = user.groups.filter((group) => {
      if (group != id) {
        return group;
      }
    });
    return user;
  });
  Users.forEach(async (user) => {
    await User.findByIdAndUpdate(user._id, { groups: user.groups });
  });

  res.status(200).json(deletedGroup);
});

router.post("/subscribe/:id", auth, async (req, res) => {
  const id = req.params.id;
  const userID = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "This Group Does not exist" });
  }
  const group = await Group.findById({ _id: id });
  if (!group) {
    return res.status(400).json({ msg: "This Group Does not exist" });
  }
  const user = await User.findById(userID);
  if (user.groups.includes(id)) {
    return res.status(400).json({ msg: "You are already in this group" });
  }
  user.groups = [...user.groups, id];
  await User.findByIdAndUpdate(userID, { groups: user.groups });

  res.status(200).json(group);
});

router.post("/unsubscribe/:id", auth, async (req, res) => {
  const id = req.params.id;
  const userID = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "This Group Does not exist" });
  }
  const group = await Group.findById({ _id: id });
  if (!group) {
    return res.status(400).json({ msg: "This Group Does not exist" });
  }

  const user = await User.findById(userID);

  if (!user.groups.includes(id)) {
    return res.status(400).json({ msg: "You are not in this group" });
  }
  user.groups = user.groups.filter((group) => {
    if (group != id) {
      return group;
    }
  });

  await User.findByIdAndUpdate(userID, { groups: user.groups });

  res.status(200).json(group);
});

module.exports = router;
