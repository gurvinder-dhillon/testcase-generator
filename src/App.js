import React from "react";
import InputForm from "./components/InputForm.js";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import Navigation from "./components/Navigation.js";
import { Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router } from "react-router-dom";
import TestGenRoutes from "./components/TestGenRoutes.js";

const App = () => {
	return (
		<>
			<Router>
				<Navigation />
				<Header />
				<Container data-bs-theme="light">
					<Row className="mt-5">
						<Col>
							<TestGenRoutes />
						</Col>
					</Row>
				</Container>
				<Footer />
			</Router>
		</>
	);
};

export default App;
