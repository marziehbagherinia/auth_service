const apiResponse = require( '../utils/helpers/api.response' );

module.exports = {
    checkHealth: ( req, res ) => {
        apiResponse( res, 'success', 'up', {} );
    },
};
