const { COUNTRY_CODES } = require( '../../enums/country.codes' );
const KavehNegarDriver = require( './drivers/kaveh.negar.driver' );

class SMSService
{
    constructor( phoneNumber )
    {
        this.phoneNumber = phoneNumber;
    }

    getDriver()
    {
        if ( this.phoneNumber.startsWith( COUNTRY_CODES.IRAN ) )
        {
            return new KavehNegarDriver();
        }

        throw new Error( 'Unsupported country code. Only +98 (Iran) is supported.' );
    }

    /**
     * Static method for initialize the sms driver.
     */
    static init( phoneNumber )
    {
        const factory = new SMSService( phoneNumber );
        return factory.getDriver();
    }
}

module.exports = SMSService;
