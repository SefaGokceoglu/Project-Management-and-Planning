const router = require("express").Router();
const User = require("../models/user.model");
const Group = require("../models/group.model");
const Project = require("../models/project.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
router.post("/register", async (req, res) => {
  try {
    const { name, lastname, email, password, passwordVerify } = req.body;

    if (!email || !name || !password || !passwordVerify || !lastname) {
      return res.status(400).json({ msg: "Please enter all fields!!" });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 character!" });
    }
    if (password !== passwordVerify) {
      return res.status(400).json({ msg: "Passwords doesnt match up!" });
    }

    const email_exist = await User.findOne({ email: email });
    if (email_exist) {
      return res.status(400).json({ msg: "Email already exists!" });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      lastname,
      email,
      password: hashPassword,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_PASSWORD);

    res.cookie("token", token, { httpOnly: true });
    res.json({ name: savedUser.name, lastname: savedUser.lastname });
  } catch (error) {
    res.status(500).json(error);
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields!" });
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ msg: "This email not registered!" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ msg: "Wrong password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_PASSWORD);

  res.cookie("token", token, { httpOnly: true });
  res.json({ name: user.name, lastname: user.lastname });
});

router.get("/logout", async (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ msg: "You are Loged Out !" });
});
router.get("/", auth, async (req, res) => {
  const currentUser = req.user;

  const UserInfos = await User.find(
    { _id: { $nin: currentUser } },
    "name lastname _id"
  );

  /*const Users = [];
  UserInfos.forEach((user) => {
    Users.push({ name: user.name, lastname: user.lastname, _id: user._id });
  });
  */
  res.status(200).json(UserInfos);
});
router.get("/:id", async (req, res) => {
  const UserLink = req.params.id.split("-");
  const UserInfo = await User.findById(
    UserLink[2],
    "groups projects name lastname email"
  );
  if (!UserInfo) {
    return res.status(400).json({ msg: " This user dont exists" });
  }
  if (
    UserInfo.name.toLowerCase() !== UserLink[0] ||
    UserInfo.lastname.toLowerCase() !== UserLink[1]
  ) {
    return res.status(400).json({ msg: "This user dont exists" });
  }
  const UserGroups = await Group.find(
    {
      _id: { $in: UserInfo.groups },
      private: false,
    },
    "name"
  );

  const Projects = await Project.find(
    {
      _id: { $in: UserInfo.projects },
    },
    "name createdBy"
  );
  const Admins = await Promise.all(
    Projects.map(async (project) => {
      return await User.findById(project.createdBy, "name lastname email");
    })
  );
  const ProjectsInfo = Projects.map((value, index) => {
    return {
      Project: { name: Projects[index].name, _id: Projects[index]._id },
      Admin: Admins[index],
    };
  });

  res
    .status(200)
    .json({ User: UserInfo, Projects: ProjectsInfo, Groups: UserGroups });
});

router.get("/account/link", auth, async (req, res) => {
  const currentUser = req.user;
  const currentUserInfo = await User.findById(currentUser);
  const link =
    "/" +
    currentUserInfo.name.toLowerCase() +
    "-" +
    currentUserInfo.lastname.toLowerCase() +
    "-" +
    currentUserInfo._id;

  res.status(200).json(link);
});

module.exports = router;
