import Courses from "../models/course.models.js";
export const schoolCourse = async (req, res) => {
  try {
    const { title, author, totalStudent, description } = req.body;
    if (!title || !author || !totalStudent || !description) {
      return res
        .status(400)
        .send({ success: false, message: "all fields are required" });
    }

    const newschoolCourse = await Courses.create({
      title,
      author,
      totalStudent,
      description,
    });
    console.log(newschoolCourse);

    res.status(201).send({
      success: true,
      message: "new courses  created successfully",
      data: newschoolCourse,
    });
  } catch (error) {
    console.log("server error", error.message);
  }
};
