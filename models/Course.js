import mongoose from "mongoose";

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
});

const Course = await mongoose.model("Course", course_schema);

export { Course };
