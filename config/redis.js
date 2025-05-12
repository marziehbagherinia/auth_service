const Redis = require( 'ioredis' );
const { redis: redisConfig } = require( './index' );

const redisClient = new Redis( {
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
    db: redisConfig.db || 0,
} );

redisClient.on( 'connect', () => {
    console.log( 'Connected to Redis' );
} );

redisClient.on( 'error', ( err ) => {
    console.error( 'Redis error:', err );
} );

module.exports = redisClient;
