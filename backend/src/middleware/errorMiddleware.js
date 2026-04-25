export function notFound(req, res, next) {
  const error = new Error(`Not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const isDev = process.env.NODE_ENV === "development";

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    stack: isDev ? err.stack : undefined
  });
}
