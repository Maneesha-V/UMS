import { errorHandler } from "./error.js";

export const verifyAdmin = async (req, res, next) => {
  if (!req.user) return next(errorHandler(401, "User not authenticated!"));
  if (!req.user.isAdmin)
    return next(errorHandler(403, "Access denied! Not an admin."));

  next();
};
