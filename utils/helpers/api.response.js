const apiResponse = (
    res, // Express response object
    status,
    message = 'The operation has done successfully.',
    data = null,
    httpStatus = 200
) => {
    return res.status( httpStatus ).json( {
        status,
        message,
        data,
    } );
};

module.exports = apiResponse;