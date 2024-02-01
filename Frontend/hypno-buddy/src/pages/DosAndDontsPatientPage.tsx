import {useEffect, useState} from "react";
import {url, useAuth} from "../contexts/AuthContext.tsx";
import styles from '../styles/DosAndDontsPatient.module.scss';

const DosAndDontsPatientPage = () => {
    const {isAuthenticated, user} = useAuth();
    const [dosAndDonts, setDosAndDonts ] = useState([]);
    const [isInDos, setIsInDos] = useState(true);

    if (!isAuthenticated || (user && user.role !== 'patient')) {
        return "Sie sind nicht berechtigt für diese Seite."; // or you can return a message or redirect to another page
    }


    useEffect(() => {
        const fetchDosAndDonts = async () => {
            try {
                const response = await fetch(url + `/dosAndDonts/dosAndDonts/user/${user?._id}`);
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
    }, [user?._id]);

    const handleSliderClick = () => {
        setIsInDos((prevIsInDos) => !prevIsInDos);
    };

    return (
        <div className={styles.layout}>
            <div className={styles.header}>
                <h1>Gemeinsam <br /> Ängste überwinden</h1>
            </div>
            <div className={styles.infotext}>
                <h3>Wir verstehen, dass es Momente gibt, in denen du dich vielleicht unsicher fühlst, besonders wenn es darum geht, die Ängste deines Kindes zu verstehen und zu unterstützen.</h3>
            </div>

            <div className={styles.container}>
                <div className={`${styles.rectangle} ${isInDos ? styles.inDonts : styles.inDos}`}
                     onClick={handleSliderClick}></div>
                <div className={styles.column} id="donts">
                    <ul>
                        {dosAndDonts
                            .filter((item) => item.type === "Don't")
                            .map((item) => (
                                <li key={item._id}>{item.text}</li>
                            ))}
                    </ul>
                </div>
                <div className={styles.column} id="dos">
                    <ul>
                        {dosAndDonts
                            .filter((item) => item.type === "Do")
                            .map((item) => (
                                <li key={item._id}>{item.text}</li>
                            ))}
                    </ul>
                </div>

            </div>

            <div className={styles.background_eclipse}>
                <div className={styles.text}>
                    <h3>Jeder kleine Schritt, den du als Elternteil machst, ist ein <br /> großer Beitrag auf der Reise deines Kindes. Du machst bereits einen bedeutenden Unterschied, und jeder weitere Schritt bringt uns näher zur Überwindung von Ängsten und zum Erblühen von Vertrauen.</h3>
                </div>
            </div>

        </div>

    );
};
export default DosAndDontsPatientPage;

