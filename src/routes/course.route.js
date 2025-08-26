import express from "express";
import { schoolCourse } from "../controllers/course.controller.js";
import {
  deleteCourse,
  getCourse,
  getOneCourse,
  updateCourse,
} from "../controllers/getCourse.controller.js";

const route = express.Router();

// post courses

route.post("/course", schoolCourse);

// get all courses

route.get("/course", getCourse);

// get single course
route.get("/course/:id", getOneCourse);

// delete route
route.delete("/course/:id", deleteCourse);

// updates course

route.put("/course/:id", updateCourse);

export default route;
