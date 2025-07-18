const jwt = require("jsonwebtoken");

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          try {
            // If token expired, refresh it
            const decodedExpired = jwt.decode(token);
            if (!decodedExpired || !decodedExpired.userId) {
              return res.status(401).json({ message: "Invalid token format" });
            }
            const refreshToken = jwt.sign(
              { userId: decodedExpired.userId },
              process.env.JWT_SECRET,
              { expiresIn: "15m" }
            );
            res.setHeader("x-refreshed-token", refreshToken);
            req.user = decodedExpired;
            return next();
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            return res.status(401).json({ message: "Error refreshing token" });
          }
        }
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      if (!decoded || !decoded.userId) {
        return res.status(401).json({ message: "Invalid token format" });
      }

      console.log("Decoded token:", decoded);
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Server error in auth middleware" });
  }
};

module.exports = { verifyToken };
