import  mongoose  from 'mongoose';

const UserSchema = new mongoose.Schema({
        companyName: {
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: [true,"Email is required"],
            unique: true,
            lowercase: true,
        },
        password:{
            type: String,
            required: [true,"Password is required"],
            minlength: 5
        }
    },{timestamps: true}
)

const User = mongoose.model('User', UserSchema);
export default User;