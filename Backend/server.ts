import {app} from "./main";
import { connectDB, ensureVerificationCodes } from './data/connectToDb';

//start the server

(async () => {
    try {
        await connectDB();

        await ensureVerificationCodes();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Error during server initialization:', err);
    }
})();



