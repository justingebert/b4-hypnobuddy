import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {DoAndDont} from "../../../../Backend/data/model/dosAndDontsModel.ts";
import DosAndDontsView from "../views/DosAndDontsView.tsx";

function FearPage() {
    const { fearId } = useParams();
    const [fearData, setFearData] = useState({});
    const [inputText, setInputText] = useState('');
    const [dosAndDonts, setDosAndDonts] = useState<DoAndDont[]>([]);
    const [selectedType, setSelectedType] = useState<'Do' | 'Don\'t'>('Do');
    const [fearTitle, setFearTitle] = useState('');

    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await fetch('http://localhost:3000/dosAndDonts/dosAndDonts');
                const data = await response.json();
                setFearData(data);
                setDosAndDonts(data);
                setFearTitle(data.name);
                console.log(fearTitle);
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
            console.error(error);
            console.error('Error saving:', error);
        }
    };


    return (
        <div>
            <h1>{fearTitle}</h1>
            <DosAndDontsView dosAndDonts={dosAndDonts}
                             selectedType={selectedType}
                             inputText={inputText}
                             onTypeChange={handleTypeChange}
                             onInputChange={handleInputChange}
                             onSaveClick={handleSaveClick}>
                             currentFearId={fearId}

            </DosAndDontsView>
            {dosAndDonts.map((item) => (
                <div key={item._id}>
                    <h4>{item.type}</h4>
                    <p>{item.text}</p>
                </div>
            ))}
        </div>
    )
}

export default FearPage;