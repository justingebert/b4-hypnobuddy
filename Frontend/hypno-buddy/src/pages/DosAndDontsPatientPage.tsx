import React, {useEffect, useState} from "react";
import {useAuth} from "../contexts/AuthContext.tsx";

const DosAndDontsPatientPage = ({ fearId }) => {
    const {isAuthenticated, user} = useAuth();
    const [dosAndDonts, setDosAndDonts ] = useState([]);

    if (!isAuthenticated || (user && user.role !== 'patient')) {
        return null; // or you can return a message or redirect to another page
    }

    useEffect(() => {
        const fetchDosAndDonts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/dosAndDonts/fears/${fearId}`);
                const data = await response.json();

                if (data) {
                    setDosAndDonts(data.dosAndDonts || []);
                } else {
                    console.error('Error fetching dos and donts:', data.message);
                }
            } catch (error) {
                console.error('Error fetching dos and donts:', error);
            }
        };
        fetchDosAndDonts();
    }, [fearId]);

    return (
        <div>
            <h1>Dos and Donts</h1>
            <div className="dos-column">
                <h3>Dos</h3>
                <ul>
                    {dosAndDonts
                        .filter((item) => item.type === 'Do')
                        .map((item) => (
                            <li key={item._id}>{item.text}</li>
                        ))}
                </ul>
            </div>
            <div className="donts-column">
                <h3>Donts</h3>
                <ul>
                    {dosAndDonts
                        .filter((item) => item.type === "Don't")
                        .map((item) => (
                            <li key={item._id}>{item.text}</li>
                        ))}
                </ul>
            </div>
        </div>

    );
};
export default DosAndDontsPatientPage;

