const jwt = require( 'jsonwebtoken' );
const User = require( '../models/user' );
const redisClient = require( '../config/redis' );
const { jwt: jwtConfig } = require( '../config' );
const apiResponse = require( '../utils/helpers/api.response' );
const { sendOTP } = require( '../utils/otp_service/otp.service' );

module.exports = {
    signIn: async ( req, res ) => {
        try {
            const { phone, email } = req.body;
            if ( !phone && !email )
            {
                throw new Error( 'Phone or email is required.' );
            }

            // Build the query by conditionally adding fields
            const query = {};
            if ( phone ) query.phone = phone;
            if ( email ) query.email = email;

            // Find or create user
            let user = await User.findOne( query );
            if ( !user )
            {
                // If user does not exist, create a new one (depends on your business logic)
                user = new User( { phone, email } );
                await user.save();
            }

            // Generate and send OTP
            const otp = await sendOTP( { phone, email } );

            // Store OTP in Redis with 5-minute expiration
            const key = phone || email;
            await redisClient.set( `otp:${key}`, otp, 'EX', 5 * 60 );

            apiResponse( res, 'success', 'OTP sent successfully' );
        }
        catch ( error ) {
            apiResponse( res, 'failed', 'Internal server error', error.toString(), 400 );
        }
    },

    verify: async ( req, res ) => {
        try {
            const { phone, email, otp } = req.body;
            if ( !otp || ( !phone && !email ) )
            {
                throw new Error( 'Phone/Email and OTP are required' );
            }

            const key = phone || email;
            const cachedOTP = await redisClient.get( `otp:${key}` );

            if ( !cachedOTP || cachedOTP !== otp )
            {
                throw new Error( 'Invalid or expired OTP' );
            }

            // OTP is valid => remove the OTP key from Redis to prevent reuse
            await redisClient.del( `otp:${key}` );

            const query = {};
            if ( phone ) query.phone = phone;
            if ( email ) query.email = email;

            // Find user
            const user = await User.findOne( query );
            if ( !user )
            {
                throw new Error( 'User not found' );
            }

            // Create JWT
            const token = jwt.sign( { userId: user._id }, jwtConfig.secret, {
                expiresIn: jwtConfig.expiresIn, // e.g. '90d'
            } );

            // Store JWT in Redis so we can validate it later very quickly
            await redisClient.set( `token:${token}`, JSON.stringify( user.toObject() ), 'EX', 90 * 24 * 60 * 60 );

            apiResponse( res, 'success', 'OTP verified successfully', { token } );
        }
        catch ( error ) {
            apiResponse( res, 'failed', 'Internal server error', error.toString(), 400 );
        }
    },

    checkToken: async ( req, res ) => {
        try {
            apiResponse( res, 'success', 'Token has been checked successfully', { is_token_valid: true, user: req.user } );
        }
        catch ( error ) {
            apiResponse( res, 'failed', 'Internal server error', { is_token_valid: false, error: error.toString() }, 400 );
        }
    },

    checkAdmin: async ( req, res ) => {
        try {
            const isAdmin = Array.isArray( req.user.roles ) && req.user.roles.some( role => [ 'admin', 'superadmin' ].includes( role ) );

            // Exclude roles from user object before sending response
            const { roles, ...userWithoutRoles } = req.user.toObject ? req.user.toObject() : req.user;

            apiResponse( res, 'success', 'Admin token has been checked successfully', { isAdmin, user: userWithoutRoles } );
        }
        catch ( error ) {
            apiResponse( res, 'failed', 'Internal server error', { isAdmin: false, error: error.toString() }, 400 );
        }
    },

    logout: async ( req, res ) => {
        try {
            // Remove token from Redis
            await redisClient.del( `token:${req.token}` );

            apiResponse( res, 'success', 'Logged out successfully', null );
        }
        catch ( error ) {
            apiResponse( res, 'failed', 'Internal server error', error.toString(), 400 );
        }
    },
};
