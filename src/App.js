import React from "react";
import InputForm from "./components/InputForm";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
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
