module.exports.isDeniedRequest = (req) => {
    return !req.body.email || !req.body.password
};

module.exports.errorHandler = (res,error) => {
    res.status(500).json({
        success: false,
        message: error.message ? error.message : error
    })
};