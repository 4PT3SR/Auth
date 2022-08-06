const AppError = require('../utils/AppError')
exports.manager = async (req,res,next) => {
    try {
        const user = req.user;
        if(user.role === 'manager' || user.role === 'admin') return next()

        throw new AppError('You are Unauthorized',403)
        
        
    } catch (error) {
        next(error);
    }
}

exports.staff = async (req,res,next) => {
    try {
        const user = req.user;
        if(user.role === 'staff' || user.role === 'admin') {
           return next()
        }
        
        throw new AppError('You are Unauthorized',403)
    } catch (error) {
        next(error);
    }
}

exports.admin = async (req,res,next) => {
    try {
        const user = req.user;
        if(user.role === 'admin') return next()
        throw new AppError('You are Unauthorized',403)
        
    } catch (error) {
        next(error);
    }
}