import { Container, Row, Col } from 'react-bootstrap';
import Logo from "../assets/hb.svg";
import styles from "../styles/Navbar.module.scss";
import '../styles/footer.scss';

const Footer = () => {
    return (
        <footer className="footer">
                <Container  className="py-3" >
                    <Row className="justify-content-between align-items-center">
                        <Col className="align-items-center">
                             <a href="/" className="align-items-center p-0 text-dark">
                                <img src={Logo} alt="logo" className={styles.logo} />
                                <span className="ms-4 h5 mb-0 font-weight-bold">Hypno Buddy</span>
                             </a>
                        </Col>
                        <Col>
                            <small className="ms-2">&copy; HypnoBuddy, 2024. All rights reserved.</small>
                        </Col>
                    </Row>
                </Container>
        </footer>
    );
};

export default Footer;
