import { app } from "./main";
import { connectDB, createMockupData, ensureVerificationCodes } from './data/connectToDb';

//start the server

(async () => {
    try {
        await connectDB();

        await ensureVerificationCodes();
        await createMockupData();

        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Error during server initialization:', err);
    }
})();



