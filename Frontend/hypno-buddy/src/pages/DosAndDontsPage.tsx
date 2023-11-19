import React, { useEffect, useState } from 'react';

function DosAndDontsPage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/dosanddonts/data', {
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
        return <div>Dos and Donts Loading...</div>;
    }

    return (
        <div className="">
            <h1>Dos And Donts</h1>
        </div>
    );
}

export default DosAndDontsPage;
