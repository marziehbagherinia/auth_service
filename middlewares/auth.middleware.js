const jwt = require( 'jsonwebtoken' );
const redisClient = require( '../config/redis' );
const { jwt: jwtConfig } = require( '../config' );

module.exports = async ( req, res, next ) => {
    try {
        const token = req.headers.authorization?.split( ' ' )[ 1 ];
        if ( !token )
        {
            return res.status( 401 ).json( { message: 'No token provided' } );
        }

        // Verify JWT signature
        const decoded = jwt.verify( token, jwtConfig.secret );

        // Check Redis to see if token is still valid (not deleted)
        const user = JSON.parse( await redisClient.get( `token:${token}` ) );

        if ( !user || user._id !== decoded.userId )
        {
            return res.status( 401 ).json( { message: 'Invalid or expired token' } );
        }

        // Token & Redis check is OK => attach user info to request
        req.user = user;
        req.token = token;
        next();
    }
    catch ( error )
    {
        console.error( error );
        return res.status( 401 ).json( { message: 'Unauthorized' } );
    }
};
