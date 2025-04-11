// This indicates an invalid response from an upstream server.
class BadGatewayError extends Error {
    constructor(message) {
      super(message);
      this.statusCode = 502;
      this.name = "BadGateway";
    }
}
  
module.exports = BadGatewayError;