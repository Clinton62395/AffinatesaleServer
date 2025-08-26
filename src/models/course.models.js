import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    totalStudent: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
    },

    title: {
      type: String,
      required: [true, "title cannot be empty"],
      minLength: [5, "title cannot be less than 5 characters"],
      maxLength: [100, "title cannot be more than 100 characters"],
      trim: true,
      index: true,
    },

    description: {
      type: String,
      minLength: [15, "the descripton  cannot be less than 15 characters"],
      maxLength: [1000, "the description cannot be more than 1000 characters"],
      required: [true, "description field cannot be empty"],
      trim: true,
    },

    author: {
      type: String,
      required: true,
      maxLength: [20, "the author name cannot be more than 20 characters"],
      trim: true,
      index: true,
    },

    about: {
      type: [String],
      maxLength: [200, "about content cannot be more than 200 characters"],
      default: [],
    },

    courseContent: {
      type: [String],
      default: [],
      maxLength: [300, "course content cannot be more than 300 characters"],
    },

    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: [true, "Review content cannot be empty"],
          minLength: [5, "Review content must be at least 5 characters long"],
          maxLength: [1000, "Review content cannot exceed 1000 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Courses = mongoose.model("Courses", courseSchema);
export default Courses;
