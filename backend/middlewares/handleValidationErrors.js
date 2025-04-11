const { validationResult } = require("express-validator");
const BadRequestError = require("../errors/BadRequestError");

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorList = errors.array().map((error) => ({
            field: error.param,
            message: error.msg,
        }));
        
        return next(new BadRequestError("Validation errors occurred", errorList));
    }
    
    next();
};

module.exports = handleValidationErrors;