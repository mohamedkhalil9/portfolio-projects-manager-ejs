export const apiFeatures = (requestQuery) => {
  const query = { ...requestQuery };
  const excludeFields = ["page", "limit", "sort", "fields"];
  excludeFields.forEach((el) => delete query[el]);

  const page = +requestQuery.page || 1;
  const limit = +requestQuery.limit || 10;
  const skip = (page - 1) * limit;

  const sort = requestQuery.sort?.split(",").join(" ");
  const fields = requestQuery.fields
    ? requestQuery.fields.split(",").join(" ")
    : "-password";

  const features = { query, skip, limit, sort, fields };
  return features;
};
