const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin" && req.user?.role !== "staff") {
    return res.status(403).json({ msg: "Access denied" });
  }
  next();
};

export default adminMiddleware;
