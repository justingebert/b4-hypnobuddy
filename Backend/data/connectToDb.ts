import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import VerificationCode from "./model/verificationCode";
import User from "./model/user"; // UUID library for generating unique codes
import { sampleTherapists, samplePatients } from "./mockupData";


// connect to mongodb
export async function connectDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/hypnobuddy', {
            //useNewUrlParser: true, //TODO this is not working why?
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
}

// disconnect from mongodb
export async function disconnectDB() {
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected successfully');
    } catch (error) {
        console.error('Error disconnecting from MongoDB', error);
        process.exit(1);
    }
}
export async function ensureVerificationCodes() {
    try{
        const requiredCodesCount = 10;
        const existingCodesCount = await VerificationCode.countDocuments({
            type: 'therapistVerification',
            used: false
        });

        const codesToGenerate = requiredCodesCount - existingCodesCount;

        if (codesToGenerate > 0) {
            const newCodes = [];
            for (let i = 0; i < codesToGenerate; i++) {
                newCodes.push({
                    code: uuidv4(),
                    type: 'therapistVerification',
                    used: false
                });
            }

            await VerificationCode.insertMany(newCodes);
        }
        console.log('Verification codes checked and generated if necessary');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }

}

/**
 * This function will create some mockup data in the database.
 * It will delete all existing users and create some new ones.
 * For testing purposes only.
 */
export async function createMockupData() {
    try {

        for (const therapistData of sampleTherapists) {
            const exists = await User.findOne({ email: therapistData.email });
            if (!exists) {
                const therapist = new User(therapistData);
                await therapist.save();
            }
        }

        // Seed patients
        for (const patientData of samplePatients) {
            const exists = await User.findOne({ email: patientData.email });
            if (!exists) {
                const patient = new User(patientData);
                await patient.save();
            }
        }

        console.log('Mockup data created successfully');
    } catch (error) {
        console.error('Error creating mockup data', error);
        process.exit(1);
    }
}