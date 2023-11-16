import {app} from "./main";
import cors from 'cors';
//! Enable CORS for frontend Port - This is for development only!!
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    "Access-Control-Allow-Credentials": true
}));
//start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


