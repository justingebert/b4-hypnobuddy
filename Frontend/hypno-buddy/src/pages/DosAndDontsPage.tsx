import React, { useEffect, useState } from 'react';
import { DoAndDont } from '../../../../Backend/data/model/dosAndDontsModel';
import DosAndDontsView from '../views/DosAndDontsView'
import TherapistCard from '../components/TherapistCard';
import '../styles/TherapistCard.module.css'

function DosAndDontsPage() {
    const [inputText, setInputText] = useState('');
    const [dosAndDonts, setDosAndDonts] = useState<DoAndDont[]>([]);
    const [selectedType, setSelectedType] = useState<'Do' | 'Don\'t'>('Do');

    // const [data, setData] = useState(null);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch('http://localhost:3000/dosanddonts/data', {
    //                 method: 'GET',
    //                 credentials: 'include',
    //             });

    //             const responseData = await response.json();
    //             setData(responseData);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    // if (!data) {
    //     return <div>Dos and Donts Loading...</div>;
    // }

    // return (
    //     <div className="">
    //         <h1>Dos And Donts</h1>
    //     </div>
    // );

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:3000/dosAndDonts/dosAndDonts');
            const data = await response.json();
            setDosAndDonts(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);
    
      const handleTypeChange = (type: 'Do' | 'Don\'t') => {
        setSelectedType(type);
      };
    
      const handleInputChange = (text: string) => {
        setInputText(text);
      };
    
      const handleSaveClick = async () => {
        try {
          const response = await fetch('http://localhost:3000/dosAndDonts/dosAndDonts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: selectedType, text: inputText }),
          });
    
          const data = await response.json();
          setDosAndDonts([...dosAndDonts, data]);
          setInputText('');
        } catch (error) {
          console.error('Error saving:', error);
        }
      };
    
      return (
        <><div className="">
          <h1>Do's and Don'ts</h1>
          <DosAndDontsView
            dosAndDonts={dosAndDonts}
            selectedType={selectedType}
            inputText={inputText}
            onTypeChange={handleTypeChange}
            onInputChange={handleInputChange}
            onSaveClick={handleSaveClick} />
        </div><div className="container mt-5">
            <div className="row">
              <div className="col-md-6 mx-auto">
                <TherapistCard />
              </div>
            </div>
          </div></>
      );
}

export default DosAndDontsPage;
