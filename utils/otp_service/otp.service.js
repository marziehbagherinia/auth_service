const nodemailer = require( 'nodemailer' );
const { email: emailConfig } = require( '../../config' );
const SMSService = require( '../sms_service/sms.service' );

// Nodemailer Transport
const transporter = nodemailer.createTransport( {
    service: emailConfig.service,
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    },
} );

// Generate an OTP (e.g., 6-digit)
function generateOTP() {
    return ( '' + Math.floor( 100000 + Math.random() * 900000 ) ).substring( 0, 6 );
}

// Send OTP via Email
async function sendEmailOTP( to, otp ) {
    const mailParams = {
        from: {
            name: emailConfig.name,
            address: emailConfig.user,
        },
        to: [ to ],
        subject: 'Your One-Time Password (OTP) for Secure Access',
        text: `Dear Customer,\nYour one-time password (OTP) for accessing your account is:\n[ ${otp} ]\nThis OTP is valid for 5 minutes. Please do not share this code with anyone to keep your account secure.\nIf you did not request this, please contact us immediately at diamondplatform.ir.\nThank you, Diamond Platform Team`,
    };

    return transporter.sendMail( mailParams );
}

// Send OTP via SMS
async function sendSMSOTP( phone, otp )
{
    const driver = SMSService.init( phone );
    await driver.sendOTP( phone, otp );
}

/**
 * Send OTP based on user's preference
 */
async function sendOTP( { phone, email } )
{
    const otp = generateOTP();

    if ( phone )
    {
        await sendSMSOTP( phone, otp );
    }
    else if ( email )
    {
        await sendEmailOTP( email, otp );
    }

    return otp;
}

module.exports = {
    sendOTP,
    generateOTP,
};
