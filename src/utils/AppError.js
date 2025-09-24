export const AppError = (res, statusCode, status, message, data = {}) => {
  return res.status(statusCode).send({ success: status, message, data });
};
