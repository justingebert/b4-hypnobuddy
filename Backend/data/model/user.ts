import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

// @ts-ignore
const userSchema = new mongoose.Schema({
    name: {
        first: {
            type: String,
            trim: true,
            required: 'First name is required'
        },
        last: {
            type: String,
            trim: true,
            required: 'First name is required'
        }
    },
    email: {
        type: String,
        required: 'Email address is required',
        unique: true, //TODO this throws ts error but works
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    role: {
        type: String,
        enum: ['patient', 'guardian', 'therapist', 'admin'],
        default: 'patient'
    },
    therapist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

    },
    patients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    patientLinkingCode: {
        type: String,
        unique: true,
    },
}, {
    timestamps: true
})

userSchema.virtual('fullName').get(function (this: any) {
    return `${this.name.first} ${this.name.last}`;
})

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

const User = mongoose.model('User', userSchema);
export default User;