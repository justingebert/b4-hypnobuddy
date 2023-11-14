import React, { useEffect, useState } from 'react';

function DosAndDontsPage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/dosanddonts/data',{
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => setData(data));
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
