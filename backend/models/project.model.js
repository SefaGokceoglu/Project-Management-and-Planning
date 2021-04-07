const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    endAt: {
      type: Date,
      default: () => Date().now + 7 * 24 * 60 * 60 * 1000,
    },
    startAt: {
      type: Date,
      default: Date().now,
    },
    data: [
      {
        TaskName: {
          type: String,
          required: true,
        },
        Resource: {
          type: String,
          default: null,
        },
        StartDate: {
          type: Date,
          required: true,
        },
        EndDate: {
          type: Date,
          required: true,
        },
        Percent: {
          type: Number,
          default: 0,
        },
        Dependencies: {
          type: String,
          default: null,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
