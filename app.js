require( 'dotenv' ).config();

const cors = require( 'cors' );
const morgan = require( 'morgan' );
const helmet = require( 'helmet' );
const express = require( 'express' );
const mongoose = require( 'mongoose' );
const User = require( './models/user' );

// Import configurations
const { host, port, mongoURI } = require( './config' );

// Import routes
const authRoutes = require( './routes/auth.routes' );
const userRoutes = require( './routes/user.routes' );
const healthRoutes = require( './routes/health.routes' );

// Create an Express app
const app = express();

// Use middlewares
app.use( helmet() );
app.use( morgan( 'dev' ) );
app.use( express.json() );

// Enable CORS with custom options
app.use( cors( {
    origin: '*',  // Allows all origins (⚠️ not recommended for production)
    methods: [ 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS' ],
    allowedHeaders: [ 'Content-Type', 'Authorization', 'Accept' ],
    credentials: true
} ) );

// Register routes
app.use( '/auth', authRoutes );
app.use( '/users', userRoutes );
app.use( '/health', healthRoutes );

// Connect to MongoDB and then start the server
mongoose
    .connect( mongoURI )
    .then( async () => {
        console.log( 'Connected to MongoDB' );

        // Synchronize indexes for the User model
        try
        {
            await User.syncIndexes();
            console.log( 'User indexes synchronized.' );
        }
        catch ( error )
        {
            console.error( 'Error synchronizing indexes:', error );
        }

        // Start the server
        app.listen( port, host, () => {
            console.log( `Server running on ${host}:${port}` );
        } );
    } )
    .catch( ( err ) =>
    {
        console.error( 'MongoDB connection error:', err );
        process.exit( 1 ); // Exit if unable to connect
    } );
