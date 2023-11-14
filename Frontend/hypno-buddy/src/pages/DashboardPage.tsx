import { useEffect, useState } from 'react';

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
            <h1>Dashboard</h1>
        </div>
    );
}

export default DashboardPage;
