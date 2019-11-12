const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.token = authorization.substring(7);
    return next();
  } else if (request.path !== "/api/blogs") {
    return next();
  } else if (request.method !== ("POST" || "PUT" || "DELETE")) {
    return next();
  }
  console.log(request.method);
  return response.status(401).json({ error: "Token missing or invalid" });
};

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: "error.message" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "invalid token" });
  }

  console.error(error.message);

  next(error);
};

module.exports = { tokenExtractor, errorHandler };
