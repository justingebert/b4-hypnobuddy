import  { useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import { Fear} from "../../../../Backend/data/model/fearModel.ts";
import TherapistCard from '../components/TherapistCard.tsx';

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
        <><div className="">
          <div>
            <h2>Fears</h2>
            {fears.map((fear) => (
              <div className="card" key={fear._id}>
                <Link className="card-content" to={`/dosanddonts/${fear._id}`}>{fear.name}</Link>
              </div>
            ))}
            <Link to={"/dosanddonts/newFear"}>Add New Fear</Link>
          </div>
        </div><div className="container mt-5">
            {/* <div className="row"> */}
              {/* <div className="col-md-6 mx-auto"> */}
                <TherapistCard/>
              {/* </div>
            </div> */}
          </div></>
      );
}

export default DosAndDontsPage;
