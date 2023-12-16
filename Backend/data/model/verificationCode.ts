import mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    therapistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    type: {
        type: String,
        enum: ['therapistVerification', 'patientLinking'],
        required: true
    },
    used: {
        type: Boolean,
        default: false
    },
    useLimit: {
        type: Number,
        default: 1 // Default to 1 for therapist verification; set higher for patient linking codes
    },
    uses: {
        type: Number,
        default: 0
    }
});

const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema);
export default VerificationCode;