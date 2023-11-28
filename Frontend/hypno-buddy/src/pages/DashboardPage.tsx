import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import '../styles/DashboardPage.css';
import '../assets/GradientHintergund.png';

function DashboardPage() {
    const [data, setData] = useState(null);
/*
    useEffect(() => {
        fetch('http://localhost:3000/dashboard/data',{
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => setData(data));
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }
*/
    return (
        <div className="dashboard">
            <div className="background-image">
                <div className="dashboard-content">
                    <h1 className="titel" >
                        Entdecke<br />dein volles Potenzial<br />mit Hypnose Buddy
                    </h1>
                    <div className="textContaner">
                        <p className="text">
                            Bereit für positive Veränderungen?<br />Starte deine Reise zu einem<br />selbstbestimmten Leben jetzt.
                        </p>
                        <Button href="/roadmap" variant="secondary" size="lg" className="button">
                            Starte jetzt!
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
