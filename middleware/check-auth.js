const jsonwebtoken = require("jsonwebtoken");

module.exports = function checkAuth(req, res, next) {

  if (req.method === "OPTIONS") {
    return next();
  }
  const token = req.query.token;
  console.log(token);
  if (!token) {
    const error = new Error("authentication failed. there is no token");
    return next(error);
  }
  try {
    const decodedToken = jsonwebtoken.verify(token, process.env.JWT_KEY);
    console.log(decodedToken);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    const errors = new Error("authentication failed. verifying token failed.");
    return next(errors);
  }
};
