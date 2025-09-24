import { AppError } from "../utils/AppError.js";

export const validateLoginInput = (req, res, next) => {
  const { name, age } = req.body;
  if (!name) {
    // return res.status(400).send({ message: "Name and age are required" });
    return AppError(res, 400, false, "Name is required");
  } 
  if (!age) {
    // return res.status(400).send({ message: "Name and age are required" });
    return AppError(res, 400, false, "Age is required");
  } 
  next()
};

// export const validateRegisterInput = async (req, res, next) => {
//   const { name, age, email } = req.body;
//   const err = {
//     nameErr: "",
//     ageErr: "",
//     emailErr: "",
//   };
//   if(!name)
// };
