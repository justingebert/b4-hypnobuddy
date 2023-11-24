import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/DashboardPage.css';

function DashboardPage() {
    const [data, setData] = useState(null);

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

    return (
        <div className="dashboard">
            <div className="background-image"></div>
            <div>
                <h1>Dashboard</h1>
                <p> hallo</p>
            </div>
        </div>
    );
}

export default DashboardPage;
