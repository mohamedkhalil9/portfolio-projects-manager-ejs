const notFound = (req, res, next) => {
  return (
    res
      .status(404)
      // .json({ status: "error", message: "this resource is not available" });
      .render("404")
  );
};

const globalErrorHandler = (error, req, res, next) => {
  res.status(error.statusCode || 500).render("error", { error });
  //   .json({
  //   status: error.statusText || "error",
  //   message: error.message,
  //   code: error.statusCode || 500,
  //   data: null,
  // });
};

export { notFound, globalErrorHandler };
