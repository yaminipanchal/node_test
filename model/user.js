const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        birthDate: {
            type: Date,
            required: true,
        },
        imgUrl: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Export the model
module.exports = mongoose.model('User', UserSchema);
