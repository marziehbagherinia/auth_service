require( 'dotenv' ).config();

module.exports = {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGO_URI,
    jwt: {
        secret: process.env.JWT_SECRET || 'fallback-secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '90d',
    },
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || '',
        db: process.env.REDIS_DB ? parseInt( process.env.REDIS_DB, 10 ) : 0,
    },
    email: {
        service: process.env.EMAIL_SERVICE || 'gmail',
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === 'true', // true for port 465,
        name: process.env.EMAIL_NAME || 'Diamond Platform',
        user: process.env.EMAIL_USER || 'diamondplatform2025@gmail.com',
        pass: process.env.EMAIL_PASS,
    },
    kaveh_negar: {
        api_key: process.env.KAVEH_NEGAR_API_KEY,
        sender_num: process.env.KAVEH_NEGAR_SENDER_NUMBER,
        otp_template: "کد تایید شما در اپلیکیشن دایاموند: " // otp_template: "کد تایید شما در اپلیکیشن دایاموند: ${otp}"
    },
};
