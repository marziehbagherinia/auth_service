const Kavenegar = require( 'kavenegar' );
const BaseDriver = require( './base.driver' );
const { kaveh_negar } = require( '../../../config/index' );
const { fillTemplate } = require( '../../../utils/helpers/helper' );

class KavehNegarDriver extends BaseDriver
{
    constructor()
    {
        super();
        this.client = Kavenegar.KavenegarApi( {
            apikey: kaveh_negar.api_key
        } );
    }

    /**
     * Concrete implementation of sendSMS
     */
    async sendSMS( phone, text )
    {
        await this.client.Send( {
            message: text,
            sender: kaveh_negar.sender_num,
            receptor: phone
        },
        function( response, status ) {
            console.log( response );
            console.log( status );
        } );
    }

    /**
     * Concrete implementation of sendOTP
     */
    async sendOTP( phone, otp )
    {
       await this.client.Send( {
            message: kaveh_negar.otp_template + otp,
            sender: kaveh_negar.sender_num,
            receptor: phone
        } );

        // this.client.Send( {
        //         message: kaveh_negar.otp_template + otp, // fillTemplate( kaveh_negar.otp_template, { otp }
        //         sender: kaveh_negar.sender_num,
        //         receptor: phone
        //     },
        //     function(response, status) {
        //         console.log(response);
        //         console.log(status);
        //     } );
    }
}

module.exports = KavehNegarDriver;
