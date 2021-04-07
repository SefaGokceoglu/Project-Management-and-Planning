const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/user.model");
const Project = require("../models/project.model");
const { rawListeners } = require("../models/user.model");

router.get("/", auth, async (req, res) => {
  const currentUser = req.user;

  const currentUserInfo = await User.findById(currentUser);

  const Projects = currentUserInfo.projects;

  const UserProjects = await Project.find({
    _id: { $in: Projects },
  });

  res.status(200).json(UserProjects);
});

router.post("/", auth, async (req, res) => {
  const { name, startAt, endAt } = req.body;
  const currentUser = req.user;

  const NewProject = new Project({
    name,
    createdBy: currentUser,
    startAt,
    endAt,
  });

  const savedProject = await NewProject.save();

  const currentUserInfo = await User.findById(currentUser);
  const ProjectsInfo = [...currentUserInfo.projects, savedProject._id];
  await User.findByIdAndUpdate(currentUser, { projects: ProjectsInfo });

  res.status(200).json(savedProject);
});

router.post("/:id", auth, async (req, res) => {
  const ProjectID = req.params.id;

  const SelectedProject = await Project.findById(ProjectID);

  if (!SelectedProject) {
    return res.status(400).json({ msg: "This Project Does Not exists" });
  }

  const Team = await User.find({ projects: { $in: ProjectID } });

  res.status(200).json({ SelectedProject, Team });
});

router.post("/join/:id", auth, async (req, res) => {
  const currentUser = req.user;

  const ProjectID = req.params.id;

  const SelectedProject = await Project.findById(ProjectID);

  if (!SelectedProject) {
    return res.status(400).json({ msg: "This Project Does Not exists" });
  }

  const currentUserInfo = await User.findById(currentUser);
  if (currentUserInfo.projects.includes(ProjectID)) {
    return res.status(400).json({ msg: "Already in the project" });
  }
  const Projects = [...currentUserInfo.projects, SelectedProject._id];
  await User.findByIdAndUpdate(currentUser, { projects: Projects });

  res.status(200).json(SelectedProject);
});

router.post("/leave/:id", auth, async (req, res) => {
  const currentUser = req.user;

  const ProjectID = req.params.id;

  const SelectedProject = await Project.findById(ProjectID);

  if (!SelectedProject) {
    return res.status(400).json({ msg: "This Project Does Not exists" });
  }

  const currentUserInfo = await User.findById(currentUser);
  if (!currentUserInfo.projects.includes(ProjectID)) {
    return res.status(400).json({ msg: "You are not in this project" });
  }
  const Projects = currentUserInfo.projects.filter(
    (project) => project != ProjectID
  );
  await User.findByIdAndUpdate(currentUser, { projects: Projects });

  res.status(200).json(SelectedProject);
});

router.delete("/:id", auth, async (req, res) => {
  const currentUser = req.user;

  const ProjectID = req.params.id;

  const SelectedProject = await Project.findByIdAndDelete(ProjectID);

  if (!SelectedProject) {
    return res.status(400).json({ msg: "This project does not exists" });
  }
  if (SelectedProject.createdBy != currentUser) {
    return res.status(400).json({ msg: "You cant delete this project" });
  }

  const Users = await User.find({ project: ProjectID });
  Users.forEach((user) => {
    user.projects = user.projects.filter((project) => {
      if (project != ProjectID) {
        return project;
      }
    });
    return user;
  });

  Users.forEach(async (user) => {
    await User.findByIdAndUpdate(user._id, { projects: user.projects });
  });

  res.status(200).json(SelectedProject);
});

router.patch("/save/:id", auth, async (req, res) => {
  const { Data } = req.body;
  const ProjectID = req.params.id;

  const Tasks = Data.map((task) => {
    return {
      TaskName: task[0],
      Resource: task[2],
      StartDate: task[3],
      EndDate: task[4],
      Dependencies: task[7],
    };
  });

  const updatedProject = await Project.findByIdAndUpdate(ProjectID, {
    data: Tasks,
  });
  console.log(updatedProject);
  res.status(200).json(Tasks);
});

module.exports = router;
