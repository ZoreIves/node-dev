import mongoose from 'mongoose'
import pick from 'lodash.pick'
import bcrypt, { genSalt } from 'bcryptjs'

// Create schema (data modeling)
const schema = {
    email : {
        type: String,
        require : [true, 'Please enter your email'],
        unique : true,
        lowercase : true,
        trim : true
    },
    password : {
        type: String,
        require : [true, 'Please enter your password'],
        trim : true,
        minlength : 6

    },
    usetname : {
        type: String,
        trim: true
    },
    photoURL : String,
    bio : String,
    url : String,
    isAdmin : Boolean
}


// Create the model
const userSchema = new mongoose.Schema(schema, {timestamps:true})

// Hansh password before sace to the database
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    }else{
        next()
    }
})

// Choose user data to send back to client
userSchema.methods.toJSON = function () {
    let userObject = this.toObject()
    return pick(userObject, ['_id', 'email', 'username', 'photoURL', 'bio', 'url'])
}

// Export Model
export const User = mongoose.model('user', userSchema)