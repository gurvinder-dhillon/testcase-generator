import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

const Navigation = () => {
	return (
		<Navbar bg="dark" data-bs-theme="dark">
			<Container>
				<Navbar.Brand href="#home" className="px-1">
					<img src="/logo.png" width="50" height="50" alt=""></img>
					<span className="px-3 h2 align-middle font-weight-bold">DHILLON</span>
				</Navbar.Brand>
				<Nav variant="underline" className="d-flex justify-content-end">
					<Nav.Link
						href="https://dhillon.guru/"
						target="_blank"
						rel="noopener noreferrer">
						Dhillon.guru
					</Nav.Link>
					<Nav.Link
						href="https://github.com/gurvinder-dhillon/testcase-generator/issues"
						target="_blank"
						rel="noopener noreferrer">
						Feature-Request
					</Nav.Link>
					<Nav.Link
						href="https://chrome.google.com/webstore/detail/element-selectors/fjgebdmbjiahfjcjaemkmifpdjaldfcc"
						target="_blank"
						rel="noopener noreferrer">
						Element-Selectors
					</Nav.Link>
					<Nav.Link
						href="https://www.linkedin.com/in/gurvinderdhillon/"
						target="_blank"
						rel="noopener noreferrer">
						Contact
					</Nav.Link>
				</Nav>
			</Container>
		</Navbar>
	);
};

export default Navigation;
