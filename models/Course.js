import mongoose from "mongoose";
import { Stats } from "./Stats.js";

const course_schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter title for your video."],
    minLength: [6, "Title should be of atleast 6 characters."],
    maxLength: [40, "Title should not exceed 20 characters."],
  },
  description: {
    type: String,
    required: [true, "Please enter description for your video."],
    minLength: [6, "Description should be of atleast 6 characters."],
    maxLength: [40, "Description should not exceed 20 characters."],
  },
  poster: {
    poster_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  lectures: [
    {
      title: {
        type: String,
        required: true,
      },
      videos: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  createdBy: {
    user_id: String,
    createdBy: {
      type: String,
      required: [true, "Enter Course Creator"],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  numOfVideos: {
    type: Number,
    default: 0,
  },
});

const Course = await mongoose.model("Course", course_schema);

Course.watch().on("change", async () => {
  const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(1);
  const course = await Course.find({});

  let totalViews = 0;
  for (let i = 0; i < course.length; i++) totalViews += course[i].views;

  stats[0].views = totalViews;
  stats[0].createdAt = new Date(Date.now());

  await stats[0].save();
});

export { Course };
