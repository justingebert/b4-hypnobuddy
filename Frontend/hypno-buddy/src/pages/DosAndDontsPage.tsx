import  { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Fear } from "../../../../Backend/data/model/fearModel.ts";


function DosAndDontsPage() {
    const [fears, setFears ] = useState<Fear[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const fearResponse = await fetch(`http://localhost:3000/dosAndDonts/fears`);

            const fearData = await fearResponse.json();
            console.log('Fears data:', fearData);

            setFears(fearData);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
      }, []);
    
      return (
        <div className="">
            <div>
                <h2>Fears</h2>
                {fears.map((fear) => (
                    <div className="card" key={fear._id}>
                        <Link className="card-content" to={`/dosanddonts/t/${fear._id}`}>{fear.name}</Link>
                    </div>
                ))}
                <Link to={"/dosanddonts/t/newFear"}>Add New Fear</Link>
            </div>
        </div>
      );
}

export default DosAndDontsPage;
