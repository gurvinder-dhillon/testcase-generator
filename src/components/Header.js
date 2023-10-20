import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Header = () => {
	return (
		<div className="bg-light">
			<Container>
				<Row className="py-3">
					<Col className="text-center">
						<h3 className="display-5">Test Gen</h3>
						<small className="lead text-muted">
							Model-Based Test Case Generation
						</small>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Header;
