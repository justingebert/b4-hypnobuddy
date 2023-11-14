import mongoose from "mongoose";

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