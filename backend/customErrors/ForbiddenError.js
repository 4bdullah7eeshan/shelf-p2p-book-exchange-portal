// This means the user is authenticated, but it's not allowed to access a resource.
class ForbiddenError extends Error {
    constructor(message) {
      super(message);
      this.statusCode = 403;
      this.name = "ForbiddenError";
    }
}
  
module.exports = ForbiddenError;
  