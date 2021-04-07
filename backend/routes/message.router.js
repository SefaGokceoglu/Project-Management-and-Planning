const router = require("express").Router();
const auth = require("../middleware/auth");
const Message = require("../models/message.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");
const Chat = require("../models/chat.model");

router.get("/:id", auth, async (req, res) => {
  const sendedBy = req.user;
  const ChatID = req.params.id;
  const chat = await Chat.findById(ChatID);
  let sendedTo;
  if (chat.recipients[0] == sendedBy) {
    sendedTo = chat.recipients[1];
  } else {
    sendedTo = chat.recipients[0];
  }

  const destinationUser = await User.findById(sendedTo);

  if (!destinationUser) {
    return res.status(400).json({ msg: "This user doesnt exisist" });
  }

  const conversation = await Message.find({
    $or: [
      { sendedBy: sendedBy, sendedTo: sendedTo },
      { sendedBy: sendedTo, sendedTo: sendedBy },
    ],
  }).sort({ createdAt: 1 });

  res.status(200).json(conversation);
});

/*
router.post("/getchat/:chatid", auth, async (req, res) => {
  const sendedBy = req.user;
  const ChatID = req.params.chatid;
  const chat = await Chat.findById(ChatID);
  let sendedTo;
  if (chat.recipients[0] == sendedBy) {
    sendedTo = chat.recipients[1];
  } else {
    sendedTo = chat.recipients[0];
  }

  const destinationUser = await User.findById(sendedTo);

  if (!destinationUser) {
    return res.status(400).json({ msg: "This user doesnt exisist" });
  }

  const conversation = await Message.find({
    $or: [
      { sendedBy: sendedBy, sendedTo: sendedTo },
      { sendedBy: sendedTo, sendedTo: sendedBy },
    ],
  }).sort({ createdAt: 1 });

  /*AdvancedChatMessages = conversation.map((message) => {
    return {
      message,
      sendedMessage: message.sendedBy == sendedBy ? true : false,
    };
  });
  console.log(conversation);
  res.status(200).json(conversation);
});
*/

router.post("/:destinationUser", auth, async (req, res) => {
  const io = req.io;
  const sendedTo = req.params.destinationUser;
  const sendedBy = req.user;
  const { text } = req.body;
  const destinationUser = await User.findById(sendedTo);

  if (!destinationUser) {
    return res.status(400).json({ msg: "This user doesnt exisist" });
  }

  let alreadyChat = await Chat.findOne({
    recipients: { $all: [sendedBy, sendedTo] },
  });
  if (alreadyChat) {
    const updatedChat = await Chat.findOneAndUpdate(
      { recipients: { $all: [sendedBy, sendedTo] } },
      { lastmessage: text }
    );
    alreadyChat = updatedChat;
  } else {
    const createChat = new Chat({
      recipients: [sendedTo, sendedBy],
      lastmessage: text,
    });
    await createChat.save();

    alreadyChat = createChat;
  }

  const newMessage = new Message({
    chat: alreadyChat._id,
    text,
    sendedTo,
    sendedBy,
  });
  /*

  io.on("connection", function (socket) {
    socket.to(alreadyChat._id).emit("NewMessage", newMessage);
  });

  */
  await newMessage.save();

  res.status(200).json(newMessage);
});

router.delete("/:destinationUser/:id", auth, async (req, res) => {
  const sendedBy = req.user;
  const destinationUser = req.params.destinationUser;
  const messageID = req.params.id;

  const deletedMessage = await Message.findByIdAndDelete(messageID);

  if (!deletedMessage) {
    return res.status(400).json({ msg: "This message doesnt exisist" });
  }

  res.status(200).json(deletedMessage);
});

module.exports = router;
