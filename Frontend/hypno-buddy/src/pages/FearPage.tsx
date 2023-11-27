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
                console.log(fearId);
                const response = await fetch(`http://localhost:3000/dosAndDonts/fears/${fearId}`);
                const data = await response.json();
                if (data) {
                    setFearData(data);
                    setDosAndDonts(data.dosAndDonts || []);
                    setFearTitle(data.name);
                    console.log(fearTitle);
                } else {
                    console.error(`Fear with ID ${fearId} not found.`);
                }
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

    const handleSaveClick = async () => {
        try {
            const url = 'http://localhost:3000/dosAndDonts/fears/addDoAndDont';
            const body = JSON.stringify({ type: selectedType, text: inputText, fearId });
            console.log('POST URL:', url);
            console.log('POST Body:', body);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            });

            const data = await response.json();
            console.log('POST Response:', data);

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
                             onSaveClick={handleSaveClick}
                             currentFearId={fearId}>

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