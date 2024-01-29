import  { useState } from 'react';
import { Carousel } from 'react-bootstrap';

/**
 * Carousel is a bootstrap component and has own styles and transitions
 * @constructor
 */
function CardCarousel() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex: number) => {
        setIndex(selectedIndex);
    };

    const itemStyle = {
        width: '100%',
        height: '100%',
        //background: 'radial-gradient(circle at bottom, #ff6641,#f2e1ec ,#f2e1ec,#9999ff)',
        background: 'rgba(237, 237, 237, 0.5)',
        display: 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
        borderRadius: '30px',
        boxShadow: '0 8px 16px rgba(62, 54, 141, 1)',
    };

    const carouselItems = [
        {
            title: 'Gemeinsam stark gegen die Angst',
            text: 'Schrittweise Eingewöhnung: Ermutigen Sie Ihr Kind dazu, in kleinen Schritten soziale Situationen zu meistern, und feiern Sie gemeinsam Erfolge.',
        },
        {
            title: 'Gelassenheit fördern',
            text: 'Vermittelt ein Verständnis dafür, dass Ängste normal sind, und fördert gemeinsam Gelassenheit im Umgang mit Herausforderungen.',
        },
        {
            title: 'Offene Kommunikation',
            text: 'Sprecht offen über eure Gefühle. Eltern können ihren Kindern dabei helfen, Ängste zu verstehen, und Kinder können ihren Eltern mitteilen, was sie beschäftigt.',
        },
        {
            title: 'Verständnis und Stärke im Umgang mit Ängsten',
            text: 'Die Herausforderungen, die Ängste mit sich bringen, betreffen uns alle. Es ist wichtig, einander zu unterstützen und gemeinsam Wege zu finden, Ängste zu bewältigen.',
        },
    ];

    return (
        <div>
            <Carousel data-bs-theme="dark" activeIndex={index} onSelect={handleSelect} className="carousel" style={{display:'inline-block'}}>
                {carouselItems.map((item, idx) => (
                    <Carousel.Item key={idx} className="carouselItem">
                        <div style={{ ...itemStyle, width: '40vw', height: '400px', marginBottom:'80px', padding: '40px', margin:'5vw'}} >
                            <h2 style={{color:'#3e368d', textAlign:'center', paddingBottom:'60px', fontSize: '2rem'}}>{item.title}</h2>

                            <p style={{color:'#3e368d', textAlign:'center', width:'28vw', fontSize: '1.5rem'}}>{item.text}</p>
                        </div>

                    </Carousel.Item>
                ))}
            </Carousel>
        </div>

    );
}
export default CardCarousel;
