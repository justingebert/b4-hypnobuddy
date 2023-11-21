import {app} from "./main";
import { connectDB, ensureVerificationCodes } from './data/connectToDb';

//start the server

(async () => {
    try {
        // Connect to the database
        await connectDB();
        console.log('Connected to DB');

        // Ensure verification codes are generated
        await ensureVerificationCodes();
        console.log('Verification codes checked and generated if necessary');

        // Start listening on the server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Error during server initialization:', err);
    }
})();



