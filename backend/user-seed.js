// user-seed.js
const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcrypt' );
require( 'dotenv' ).config(); // To load environment variables from .env file
const { Schema } = mongoose;

// Define the User schema
const userSchema = new Schema( {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
} );

// Create the User model
const User = mongoose.model( 'user', userSchema );

// Get the MongoDB URI from environment variables
const mongoURI = process.env.MONGODB_URI;

// List of users to add (replace with your desired usernames and passwords)
const users = [
    { username: 'admin', password: '34TeLomery#' },
    { username: 'jaskowij', password: '34TeLomery#' },
];

async function createUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect( mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } );

        console.log( 'Connected to MongoDB' );

        // Iterate over each user
        for ( const userData of users ) {
            // Check if user already exists
            const existingUser = await User.findOne( { username: userData.username } );
            if ( existingUser ) {
                console.log( `User ${ userData.username } already exists. Skipping...` );
                continue;
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash( userData.password, 10 );

            // Create a new user instance
            const user = new User( {
                username: userData.username,
                password: hashedPassword,
            } );

            // Save the user to the database
            await user.save();

            console.log( `User ${ userData.username } created successfully.` );
        }

        console.log( 'User creation script completed.' );

        // Close the connection
        await mongoose.disconnect();
        console.log( 'Disconnected from MongoDB' );
    } catch ( error ) {
        console.error( 'Error creating users:', error );
    }
}

createUsers();
