const {registerSchema,loginSchema,recoverPasswordEmailSchema,PasswordSchema} = require('../utils/joiValidation');
const User = require('../models/userModel')
const AppError = require('../utils/AppError');
const crypto = require('crypto');
const sendMail = require('../utils/sendMail');


// @route                  POST /register
// @description
// @acccess                PUBLIC
exports.register = async(req,res,next) => {
    try {

        const body = await registerSchema.validateAsync(req.body)
        await User.create(body);
        res.status(201).json({status: 'Success',message:'User has been registered'});
    } catch (error) {
        next(error);
    }
}



// @route                  POST /login
// @description
// @acccess                PUBLIC
exports.login = async (req,res,next) => {
    try {
         const payload = await loginSchema.validateAsync(req.body);
         const {email,password} = payload;
         const user = await User.getCredentials(email,password);
         let token = await user.generateAuthToken();
         res.status(200).json({status: 'success',user,authToken:token});


    } catch (error) {
        next(error);
    }
}


// @route                  POST /logout
// @description
// @acccess                auth(user,manager,admin,staff)
exports.logout = async (req,res,next) => {
    try { 
        let user = req.user
        let currentToken = req.authToken;
        user.tokens = user.tokens.filter(token =>{
        return token.token !== currentToken;
     });
     await user.save()
     res.status(200).json({status: 'Success',message:'Logged out sucessfully'});
     } catch (err) {
         next(e);
     }
 
 }
 


// @route                  POST /logoutall
// @description
// @acccess                auth(user,manager,admin,staff)
 exports.logoutAll = async (req,res,next) => {
     try { 
         req.user.tokens = [];
         res.status(200).json({status: 'Success',message:'Logged out of all devices sucessfully'})
     } catch (error) {
        next(error);
     }
 }

// @route                  POST /resetpassword
// @description
// @acccess                PUBLIC
exports.resetPassword = async (req,res,next) => {
    try {
        let payload = await recoverPasswordEmailSchema.validateAsync(req.body);
        const {email} = payload;
        const user = await User.findOne({email:email});
        if(!user) {
            throw new AppError('User with this email does not exist',400);
        }
            // Verification Token Generation
        let passwordResetToken = await user.generatePasswordResetToken();

        let verificationUrl = `${req.protocol}://${req.get('host')}/resetpassword/${passwordResetToken}`;
        const message = `Hello ${user.first_name}, /n Follow this to reset your password, link expires in 5mins /n ${verificationUrl}`;

        await sendMail({
            email: email,
            subject: `Reset Password`,
            message
        })

        res.status(200).json({status: 'Success',message:'Check your mail to reset password'})
    } catch (error) {
        next(error)
    }
}


// @route                  POST /resetpassword?:passwordresetToken
// @description
// @acccess                PUBLIC
exports.setPassword = async (req,res,next) => {
    try {
        const passwords = await PasswordSchema.validateAsync(req.body);
        const {password} = passwords;
        let passwordresetToken = req.params.passwordresetToken;
        let hashed = crypto.createHash('sha256').update(passwordresetToken).digest('hex');


        let user = await User.findOne({password_reset_token:hashed})
            if(!user) {
                throw new AppError('Token is invalid or has expired',400);
            }

            user.password = password;
            user.password_reset_token = undefined;
            user.password_reset_token_expiry = undefined;
            await user.save();
        res.status(200).json({status: 'Success', message:'Password has been reset, Login with your new Password'})
    } catch (e) {
        next(e);
    }
}



// @route                  POST /staff
// @description
// @acccess                auth(staff)
 exports.staff = async (req,res,next) => {
    try{
        const user = req.user;
        res.status(200).json({status: 'success',message:'This is a protected route for staffs',user})
    } catch (error) {
        next(error)
    }
 }


 // @route                  POST /manager
// @description
// @acccess                auth(manager)
 exports.manager = async (req,res,next) => {
    try{
        const user = req.user;
        res.status(200).json({status: 'success',message:'This is a protected route for managers',user})
    } catch (error) {
        next(error)
    }
 }


 // @route                  POST /admin
// @description
// @acccess                auth(admin)
 exports.admin = async (req,res,next) => {
    try{
        const user = req.user;
        res.status(200).json({status: 'success',message:'This is a protected route for user',user})
    } catch (error) {
        next(error)
    }
 }