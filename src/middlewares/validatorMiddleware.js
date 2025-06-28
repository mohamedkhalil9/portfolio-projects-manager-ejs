const validate = (schema, source) => {
  return async (req, res, next) => {
    const data =
      source === "body"
        ? req.body
        : source === "params"
          ? req.params
          : req.query;

    const { error } = await schema.validate(data);
    if (error)
      return res.status(422).json({ status: "error", message: error.message });
    next();
  };
};

export const validateBody = (schema) => validate(schema, "body");

export const validateParams = (schema) => validate(schema, "params");

export const validateQuery = (schema) => validate(schema, "query");
