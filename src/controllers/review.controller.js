import User from "../models/users.models.js";
import Courses from "../models/course.models.js";

export const userComment = async (req, res) => {
  try {
    const { userId } = req.user;
    const { courseId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res
        .status(400)
        .send({ success: false, message: "comment cannot be empty" });
    }

    // find user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "user not found" });
    }
    // new comment
    const newContent = {
      userId,
      content,
    };

    const updateCourse = await Courses.findByIdAndUpdate(
      courseId,
      { $push: { reviews: newContent } },
      {
        new: true,
      }
    );

    if (!updateCourse) {
      return res
        .status(404)
        .send({ success: false, message: "course not found" });
    }

    res.status(200).send({
      success: true,
      message: "comment created successfully",
      comment: newContent,
    });
  } catch (error) {
    console.error("internal error", error.message);
    if (error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: "format id invalid",
      });
    }
    res.status(500).send({
      success: false,
      message: "server error",
    });
  }
};
