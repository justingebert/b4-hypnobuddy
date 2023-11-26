import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {DoAndDont} from "../../../../Backend/data/model/dosAndDontsModel.ts";
import DosAndDontsView from "../views/DosAndDontsView.tsx";

function FearPage() {
    const [inputText, setInputText] = useState('');
    const {fearId } = useParams();
    const [dosAndDonts, setDosAndDonts] = useState<DoAndDont[]>([]);
    const [selectedType, setSelectedType] = useState<'Do' | 'Don\'t'>('Do');

    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await fetch('http://localhost:3000/dosAndDonts/dosAndDonts');
                //const response = await fetch (`http://localhost:3000/fears/${fearId}`);
                const data = await response.json();
                setDosAndDonts(data);
            } catch(error) {
                console.error('Error fetching data;', error);
            }
        };
        fetchData();
    }, [fearId]);

    const handleTypeChange = (type: 'Do' | 'Don\'t') => {
        setSelectedType(type);
    };

    const handleInputChange = (text: string) => {
        setInputText(text);
    };

    const handleSaveClick = async (fearId: string) => {
        try {
            const response = await fetch('http://localhost:3000/dosAndDonts/dosAndDonts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type: selectedType, text: inputText, fearId }),
            });

            const data = await response.json();
            setDosAndDonts([...dosAndDonts, data]);
            setInputText('');
        } catch (error) {
            console.error('Error saving:', error);
        }
    };


    return (
        <div>
            <h1>Dos and Donts for Fear</h1>
            <DosAndDontsView dosAndDonts={dosAndDonts}
                             selectedType={selectedType}
                             inputText={inputText}
                             onTypeChange={handleTypeChange}
                             onInputChange={handleInputChange}
                             onSaveClick={handleSaveClick}>

            </DosAndDontsView>
            {dosAndDonts.map((item, index) => (
                <div key={item._id || index}>
                    <h4>{item.type}</h4>
                    <p>{item.text}</p>
                </div>
            ))}
        </div>
    )
}

export default FearPage;