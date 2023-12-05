import React, {useEffect, useState} from "react";
import {useAuth} from "../contexts/AuthContext.tsx";
import styles from '../styles/DosAndDontsPatient.module.css';

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
        <div className={styles.layout}>
            <div className={styles.background}>
                <div className={styles.header}>
                    <h1>Gemeinsam <br /> Ängste überwinden</h1>
                </div>
                <div className={styles.infotext}>
                    <p>Wir verstehen, dass es Momente gibt, in denen du dich vielleicht unsicher fühlst, besonders wenn es darum geht, die Ängste deines Kindes zu verstehen und zu unterstützen.</p>
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.column}>
                    <ul>
                        {dosAndDonts
                            .filter((item) => item.type === "Don't")
                            .map((item) => (
                                <li key={item._id}>{item.text}</li>
                            ))}
                    </ul>
                </div>
                <div className={styles.column}>
                    <ul>
                        {dosAndDonts
                            .filter((item) => item.type === "Do")
                            .map((item) => (
                                <li key={item._id}>{item.text}</li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>

    );
};
export default DosAndDontsPatientPage;

