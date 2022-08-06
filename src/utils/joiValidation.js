const Joi = require('joi');


const registerSchema = Joi.object({
    first_name: Joi.string().required().min(3).max(13),

    last_name: Joi.string().required().min(3).max(13),

    email: Joi.string().email({minDomainSegments:2,tlds:{allow:['com','net']}}).required(),

    role: Joi.string().valid('user','manager','staff').messages({
        'any.only': 'role can only be a user or manager or staff'
    }),

    password: Joi.string().min(8).required(),

    confirm_password: Joi.string().min(8).valid(Joi.ref('password')).required().messages({
        'any.only': 'Confirm password must match with password'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email({minDomainSegments:2,tlds:{allow:['com','net']}}).required(),

    password: Joi.string().min(8).required(),
})

const recoverPasswordEmailSchema = Joi.object({
    email: Joi.string().email({minDomainSegments:2,tlds:{allow:['com','net']}}).required()
})

const PasswordSchema = Joi.object({
    password: Joi.string().min(8).required(),

    confirm_password: Joi.string().min(8).valid(Joi.ref('password')).required().messages({
        'any.only': 'Confirm password must match with password'
    })
})
module.exports = {registerSchema,loginSchema,recoverPasswordEmailSchema,PasswordSchema};