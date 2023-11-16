import React, { useEffect, useState } from 'react';

function RoadmapPage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/roadmap/data', {
                    method: 'GET',
                    credentials: 'include',
                });

                const responseData = await response.json();
                setData(responseData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    if (!data) {
        return <div>Roadmap Loading...</div>;
    }

    return (
        <div className="">
            <h1>Roadmap</h1>
        </div>
    );
}

export default RoadmapPage;
