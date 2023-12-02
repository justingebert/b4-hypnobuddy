import { Container, Row, Col } from 'react-bootstrap';
import Logo from "../assets/hb.svg";
import styles from "../styles/Navbar.module.css";

const Footer = () => {
    return (
        <footer>
            <div style={{ backgroundColor: '#c5b6f1' }}>
                <Container fluid className="py-4" style={{ width: '80%', backgroundColor: '#c5b6f1'}}>
                    <Row className="justify-content-between align-items-center">
                        <Col className="d-flex align-items-center">
                             <a href="/" className="d-flex align-items-center p-0 text-dark">
                                <img src={Logo} alt="logo" className={styles.logo} />
                                <span className="ms-4 h5 mb-0 font-weight-bold">Hypno Buddy</span>
                             </a>
                        </Col>
                        <Col>
                            <small className="ms-2">&copy; HypnoBuddy, 2023. All rights reserved.</small>
                        </Col>
                    </Row>
                </Container>
            </div>
        </footer>
    );
};

export default Footer;
