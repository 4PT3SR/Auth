const AppError = require('../utils/AppError')
module.exports = function (req,res,next) {
    next(new AppError(`${req.url} API does not exist`,404));
}

