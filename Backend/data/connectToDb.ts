import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import VerificationCode from "./model/verificationCode"; // UUID library for generating unique codes


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
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }

}