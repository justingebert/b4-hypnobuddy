import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from "../contexts/AuthContext.tsx";
import '../styles/DashboardPage.css';
import CardCarousel from "../components/CardCarousel.tsx";
import {Row, Button, Col} from "react-bootstrap";


function DashboardPage() {

    const { isAuthenticated, user} = useAuth();
    return (
        <div>
            <Row className="background-image">
                <div className="dashboard-content">
                    <h1 className="titel" >
                        Entdecke<br />dein volles Potenzial<br />mit Hypno Buddy
                    </h1>
                    <div className="textContaner">
                        <p className="text">
                            Bereit für positive Veränderungen?<br />Starte deine Reise zu einem<br />selbstbestimmten Leben jetzt.
                        </p>
                        {isAuthenticated && user ? (
                        <Button href="/roadmap" variant="secondary" size="lg" className="button">
                            Starte jetzt!
                        </Button>
                                ) : (
                            <Button href="/login" variant="secondary" size="lg" className="button">
                                Starte jetzt!
                            </Button>

                                )}
                    </div>
                </div>
            </Row>
            <Row>
                {isAuthenticated && user ? (
                    <div>
                        <div className="CardCarousel" style={{display:'flex'}}>
                            <CardCarousel></CardCarousel>
                        </div>
                        <Row className="eyeDiv">
                            <Col className="eyeBackground">
                                <p className="eyeText">
                                    Nehmen Sie sich einen kurzen Augenblick Zeit, um mit uns in eine Welt der Fantasie einzutauchen und positive Veränderungen zu entdecken.
                                </p>
                            </Col>
                            <Col className="eyePic">
                            </Col>
                        </Row>
                    </div>
                ) : null}
            </Row>
        </div>
    );
}

export default DashboardPage;
