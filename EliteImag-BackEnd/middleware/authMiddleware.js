import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      status: "error",
      message: "Access denied. No token provided."
    });
  }

  const token = authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Invalid token format. Use: Bearer <token>"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Invalid or expired token"
    });
  }
};