import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InputForm from "./InputForm.js";
import TestGenHelp from "./TestGenHelp.js";

const TestGenRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<InputForm />} />
			<Route path="/help" element={<TestGenHelp />} />
		</Routes>
	);
};

export default TestGenRoutes;
