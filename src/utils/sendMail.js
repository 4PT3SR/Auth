const nodemailer = require('nodemailer');
// const {google} = require('googleapis');
const AppError = require('./AppError')

// const OAuth2Client = new google.auth.OAuth2(clientId, clientSecret,redirectUri);
// OAuth2Client.setCredentials({refreshToken:refreshToken});

const email = process.env.EMAIL
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const redirectUri = process.env.REDIRECT_URI
const refreshToken = process.env.REFRESH_TOKEN


const sendMail = async (options) => {
    try {
    
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: email,
                pass: process.env.EMAIL_PASSWORD,
                clientId: clientId,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
            }
        })

        const mailOptions = {
            from: 'Aptest',
            to: options.email,
            subject: options.subject,
            text:options.message,
        }

        const result = await transport.sendMail(mailOptions)
        return result;
    
    } catch (error) {
        
        throw new AppError(error);
    }
}


module.exports = sendMail;