function errorHandler(err, res, req, next) {
        if (err.name === 'UnauthorizedError') {
            // jwt auth error
            res.status(401).json({message: 'User is not Authorized'})
        }

        if (err.name === 'ValidationError') {
            // validation error
            res.status(401).json({message: err})
        }
        // defaults to 500 server error
        return res.status(500).json({message: err})
}

module.exports = errorHandler();