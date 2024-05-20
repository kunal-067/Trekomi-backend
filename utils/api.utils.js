exports.asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (err) {
        console.log('Error:', err);
        return res.status(err.statusCode || 500).send(
            new this.ApiError(500, err.message || "Internal Server Error ! please try later." , err.message, err.stack)
        )
    };
}


exports.ApiResponse = class {
    constructor(statusCode, message, data) {
        this.statusCode = statusCode;
        this.message = message || "Successfull !";
        this.data = data || null;
    }
}

exports.ApiError = class extends Error {
    constructor(statusCode, message, error, stack) {
        super(message)

        this.statusCode = statusCode;
        this.message = message;
        this.error = error || [];

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}