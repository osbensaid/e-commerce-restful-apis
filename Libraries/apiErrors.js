// @desc    this class responsible about operatione errors
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message, statusCode);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
  }
}

module.exports = ApiError;
