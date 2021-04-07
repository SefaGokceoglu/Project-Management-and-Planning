const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ msg: " Unauthorized !" });
    }

    const jwtUser = jwt.verify(token, process.env.JWT_PASSWORD);

    req.user = jwtUser.id;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: " Unauthorized !" });
  }
}

module.exports = auth;
