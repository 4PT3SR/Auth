const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('../utils/AppError')

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: [true,'Email already registered']
    },
    role: {
        type: String,
        enum: ['user','staff','manager','admin'],
        default: 'user'
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required:true,
        minlength: 8
    },
    password_reset_token: {
        type: String
    },
    password_reset_token_expiry: {
        type: Date
    },tokens:[{token: {
        type: String,
        required: true
    }}]
},{timestamps:true});

userSchema.pre('save', async function (next){
    const user = this;
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,10);
    }
    next()
} )

userSchema.statics.getCredentials = async function (email,password) {

    let user = await User.findOne({email:email});
     let errResponse = 'Incorrect Email or Password'
     if(!user) {
         throw new AppError(errResponse,400);
     }
     let isPasswordCorrect = await bcrypt.compare(password, user.password);
     
     if(!isPasswordCorrect) {
         throw new AppError(errResponse,400);
     }
     return user;
 }

 userSchema.methods.generateAuthToken = async function() {
    const user = this;
    let token = jwt.sign({_id:user._id.toString()},process.env.jwt_secret);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;

}

userSchema.methods.generatePasswordResetToken = function() {
    const user = this;
    const passwordResetToken = crypto.randomBytes(32).toString('hex');
    user.password_reset_token = crypto.createHash('sha256').update(passwordResetToken).digest('hex');
    user.password_reset_token_expiry = Date.now() + 5 * 60 * 1000;
    user.save();
    return passwordResetToken;
}

userSchema.methods.toJSON = function() {

    const user = this;
    let userObject = user.toObject();
    delete userObject.tokens
    delete userObject.password
    delete password_reset_token
    delete password_reset_token_expiry
    delete __v
    return userObject;
}

const User = new mongoose.model('User',userSchema);


module.exports = User;

// var transport = nodemailer.createTransport({
//     host: "smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//       user: "191c877d7ab5c3",
//       pass: "b43b73eb42fc5d"
//     }
//   });