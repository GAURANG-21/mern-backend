import mongoose from 'mongoose'
import validator from 'email-validator'

const user_schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name."]
    },
    email: {
        type: String,
        required: [true,"Please enter your email."],
        unique: true,
        validator: validator.validate()
    },
    password:{
        type: String,
        required: [true,"Please enter your password."],
        minLength: [6,"Create password of atleast 6 characters."],
        select: false
    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    avatar:{
        public_id: {
            type: String, 
            required: true
        },
        url: {
            type: String, 
            required: true
        }
    },
    //*To be taken from RazorPay
    subscription:{
        id: String, 
        status: String
    },
    //*Just like youtube play list. It has array of courses.
    //*Playlist --> Courses --> Lectures̥
    playlist:[
        {
            course: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course"
            },
            poster: String
        }
    ], 
    createdAt:{
        type: Date,
        default: Date.now()
    }, 
    ResetPasswordToken: String,
    ResetPasswordExpire: String
})

const User = mongoose.Model('User', user_schema);

module.exports = User