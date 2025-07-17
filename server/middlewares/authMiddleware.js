const jwt = require("jsonwebtoken");

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        // If token expired, refresh it
        const refreshToken = jwt.sign(
          { userId: decoded?.userId },
          process.env.JWT_SECRET,
          { expiresIn: "15m" }
        );
        res.setHeader("x-refreshed-token", refreshToken);
        req.user = decoded;
        return next();
      }
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };
