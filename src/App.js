import React from "react";
import InputForm from "./components/InputForm.js";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import Navigation from "./components/Navigation.js";
import { Container, Row, Col } from "react-bootstrap";

const App = () => {
	return (
		<>
			<Navigation />
			<Header />
			<Container data-bs-theme="light">
				<Row className="mt-5">
					<Col>
						<InputForm />
					</Col>
				</Row>
			</Container>
			<Footer />
		</>
	);
};

export default App;
