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

module.exports = { tokenExtractor };
