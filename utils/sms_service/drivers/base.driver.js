class BaseDriver
{
    constructor()
    {
        // Prevent direct construction
        if ( new.target === BaseDriver )
        {
            throw new Error( "Cannot instantiate an abstract class directly." );
        }
    }

    /**
     * Must be overridden by subclass
     *
     * @param {string} phone
     * @param {string} text
     */
    sendSMS( phone, text )
    {
        throw new Error( "sendSMS() must be implemented by subclass." );
    }

    /**
     * Must be overridden by subclass
     *
     * @param {string} phone
     * @param {string} otp
     */
    sendOTP( phone, otp )
    {
        throw new Error( "sendOTP() must be implemented by subclass." );
    }
}

module.exports = BaseDriver;
