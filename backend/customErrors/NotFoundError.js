// This indicates that a resource is not found.
class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.statusCode = 404;
      this.name = "NotFoundError";
    }
}
  
module.exports = NotFoundError;
  