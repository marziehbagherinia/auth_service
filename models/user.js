const mongoose = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

const userSchema = new mongoose.Schema( {
    phone: {
        type: String,
        trim: true,
        unique: true, // ensure index exists
        sparse: true,
        validate: {
            validator: function ( value ) {
                return /^\+[1-9]\d{1,14}$/.test( value );
            },
            message: ( props ) => `${props.value} is not a valid phone number!`
        }
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true, // ensure index exists
        sparse: true,
        validate: {
            validator: function ( value ) {
                return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i.test( value );
            },
            message: ( props ) => `${props.value} is not a valid email address!`
        }
    },
    roles: {
        type: [ String ],
        enum: [ 'superadmin', 'admin', 'editor', 'member', 'viewer' ],
        default: [ 'member' ],
        select: false
    }
}, { timestamps: true } );

// Apply the unique validator plugin with a custom error message
userSchema.plugin( uniqueValidator, { message: '{PATH} already exists.' } );

userSchema.pre( 'validate', function ( next ) {
    if ( !this.phone && !this.email )
    {
        return next( new Error( 'Either phone or email is required.' ) );
    }
    next();
} );

userSchema.pre( 'save', function ( next ) {
    if ( this.isModified( 'roles' ) )
    {
        return next( new Error( 'Roles cannot be modified through the application.' ) );
    }
    next();
} );

userSchema.pre( 'findOneAndUpdate', function ( next ) {
    if ( this.getUpdate().roles )
    {
        return next( new Error( 'Roles cannot be modified through the application.' ) );
    }
    next();
} );

module.exports = mongoose.model( 'User', userSchema );
