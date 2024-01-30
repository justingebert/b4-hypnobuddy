import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import VerificationCode from "./model/verificationCode";
import User from "./model/user"; // UUID library for generating unique codes
import { sampleTherapists, samplePatients } from "./mockupData";


// connect to mongodb
export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/hypnobuddy', {
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
    try {
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

        const therapistDocs = [];
        for (const therapistData of sampleTherapists) {
            const therapist = await findOrCreateUser(therapistData);
            therapistDocs.push(therapist);
        }

        // Seed patients
        const patientDocs = [];
        for (const patientData of samplePatients) {
            const patient = await findOrCreateUser(patientData);
            patientDocs.push(patient);
        }

        // Distribute patients to therapists
        distributePatients(therapistDocs, patientDocs);

        // Save updated therapist and patient documents
        for (const therapist of therapistDocs) {
            await therapist.save();
        }
        for (const patient of patientDocs) {
            await patient.save();
        }

        console.log('Mockup data created successfully');
    } catch (error) {
        console.error('Error creating mockup data', error);
        process.exit(1);
    }
}

const distributePatients = (therapists, patients) => {
    therapists.forEach(therapist => {
        therapist.patients = therapist.patients.filter(patientId =>
            !patients.some(mockupPatient => mockupPatient._id.equals(patientId)));
    });

    patients.forEach(patient => patient.therapist = null);
    // Example distribution logic
    let patientIndex = 0;
    for (const therapist of therapists) {
        const numberOfPatients = Math.ceil(Math.random() * 3); // Assign 1-3 patients per therapist
        for (let i = 0; i < numberOfPatients; i++) {
            if (patientIndex < patients.length) {
                therapist.patients.push(patients[patientIndex]._id);
                patients[patientIndex].therapist = therapist._id;
                patientIndex++;
            } else {
                break;
            }
        }
    }
};

const findOrCreateUser = async (userData) => {
    let user = await User.findOne({ email: userData.email });
    if (!user) {
        user = new User({
            email: userData.email,
            name: userData.name,
            role: userData.role
        });
        await User.register(user, userData.password);
    }
    return user;
};
