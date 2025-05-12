const User = require( '../models/user.js' );
const redisClient = require( '../config/redis' );
const apiResponse = require( '../utils/helpers/api.response' );

module.exports = {
    // List all users
    index: async ( req, res ) => {
        try {
            // Extract pagination parameters from query string
            let { page = 1, perPage = 10 } = req.query;

            // Convert to integers and ensure valid numbers
            page = Math.max( parseInt( page ), 1 ); // Ensure page is at least 1
            perPage = Math.max( parseInt( perPage ), 1 ); // Ensure limit is at least 1

            // Calculate how many documents to skip
            const skip = ( page - 1 ) * perPage;

            // Fetch paginated users
            const users = await User.find()
                .skip( skip )
                .limit( perPage );

            // Count total documents (for pagination info)
            const totalUsers = await User.countDocuments();

            // Calculate total pages
            const totalPages = Math.ceil( totalUsers / perPage );

            apiResponse( res, 'success', 'User has indexed successfully', {
                items: users,
                page: page,
                perPage: perPage,
                totalPages: totalPages,
                totalItems: totalUsers,
            } );
        }
        catch ( error ) {
            apiResponse( res, 'failed', 'Internal server error', error.toString(), 400 );
        }
    },

    // Show a single user
    show: async ( req, res ) => {
        try {
            const user = await User.findById( req.params.id );
            if ( !user )
            {
                throw new Error( 'User not found.' );
            }

            apiResponse( res, 'success', 'User has shown successfully', user );
        }
        catch ( error ) {
            apiResponse( res, 'failed', 'Internal server error', error.toString(), 400 );
        }
    },

    // Update user
    update: async ( req, res ) => {
        try {
            // Determine the user id from the URL parameter or the authenticated user

            console.log(req.user);

            const userId = req.params.id || ( req.user && req.user._id );

            if ( !userId )
            {
                throw new Error('User ID not provided.');
            }

            const user = await User.findByIdAndUpdate( userId, req.body, {
                new: true,
                runValidators: true // Enables schema validation on update
            } );

            if ( !user )
            {
                throw new Error( 'User not found.' );
            }

            const token = req.headers.authorization?.split( ' ' )[ 1 ];
            if ( !token )
            {
                return res.status( 401 ).json( { message: 'No token provided' } );
            }

            await redisClient.set( `token:${token}`, JSON.stringify( user.toObject() ), 'EX', 90 * 24 * 60 * 60 );

            apiResponse( res, 'success', 'User has updated successfully', user );
        }
        catch ( error ) {
            apiResponse( res, 'failed', 'Internal server error', error.toString(), 400 );
        }
    },

    // Delete user
    delete: async ( req, res ) => {
        try {
            const user = await User.findByIdAndDelete( req.params.id );
            if ( !user )
            {
                throw new Error( 'User not found.' );
            }

            apiResponse( res, 'success', 'User has deleted successfully', user );
        }
        catch ( error ) {
            apiResponse( res, 'failed', 'Internal server error', error.toString(), 400 );
        }
    },
};
