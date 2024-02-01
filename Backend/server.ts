import { app } from "./main";
import { connectDB, createMockupData, ensureVerificationCodes } from './data/connectToDb';

console.log('Starting server...');

(async () => {
    try {
        await connectDB();

        await ensureVerificationCodes();
        await createMockupData();

        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Error during server initialization:', err);
    }
})();



