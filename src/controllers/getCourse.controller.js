import Courses from "../models/course.models.js";

// get all courses
export const getCourse = async (req, res) => {
  try {
    const coursData = await Courses.find({});

    res.status(200).send({
      success: true,
      message: "Data fetched successfully",
      data: coursData,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "server error", error: error.message });
  }
};

// get single course controllers
export const getOneCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const courseData = await Courses.findById(id);

    if (!courseData) {
      return res
        .status(404)
        .send({ success: false, message: "Course not found" });
    }

    res.status(200).send({
      success: true,
      message: "Data fetched successfully",
      data: courseData,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .send({ success: false, message: "Invalid ID format" });
    }
    return res
      .status(500)
      .send({ success: false, message: "server error", error: error.message });
  }
};

// delete data
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourse = await Courses.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res
        .status(404)
        .send({ success: false, message: "Course not found" });
    }

    res
      .status(200)
      .send({ success: true, message: "Data deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .send({ success: false, message: "Invalid ID format" });
    }
    return res
      .status(500)
      .send({ success: false, message: "server error", error: error.message });
  }
};

// update data
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCourse = await Courses.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCourse) {
      return res
        .status(404)
        .send({ success: false, message: "Course not found" });
    }

    res.status(200).send({
      success: true,
      message: "Data updated successfully",
      data: updatedCourse, 
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .send({ success: false, message: "Invalid ID format" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).send({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }
    return res
      .status(500)
      .send({ success: false, message: "server error", error: error.message });
  }
};
