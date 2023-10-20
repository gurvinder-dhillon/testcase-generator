import React, { useState, useEffect } from "react";
import generateTestCases from "../utils/generateTestCases.js";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import InputTable from "./InputTable.js";
import OutputTable from "./OutputTable.js";
import gaEvents from "../utils/gaEvents.js";

const InputForm = () => {
	const defaultJsonInput = [
		{
			key: "OS",
			values: ["Mac", "Win", "Linux", "negative(FireOS)"]
		},
		{
			key: "Browser",
			values: ["Chrome", "Edge", "Safari", "Firefox"]
		},
		{
			key: "Device",
			values: ["Macbook", "Surface", "Chromebook", "negative(iPad)"]
		}
	];

	const [jsonInput, setJsonInput] = useState(
		JSON.stringify(defaultJsonInput, null, 2)
	);

	const [showJsonInput, setShowJsonInput] = useState(false);

	const toggleInputView = () => {
		setShowJsonInput(!showJsonInput);
	};

	const [stringInput, setStringInput] =
		useState(`IF [OS] = "Mac"   THEN [Browser] <> "Edge";
IF [OS] = "Win"   THEN [Browser] <> "Safari";`);
	const [output, setOutput] = useState([]);
	const [inputTable, setInputTable] = useState(defaultJsonInput);
	const [orderOptions, setOrderOptions] = useState([{ value: 2, label: "2" }]);
	const [orderValue, setOrderValue] = useState(2);

	useEffect(() => {
		const numColumns = inputTable.length - 2;
		const newOrderOptions = [
			{ value: 1, label: "1" },
			{ value: 2, label: "2" }
		];
		for (let i = 1; i <= numColumns; i++) {
			newOrderOptions.push({ value: i + 2, label: i + 2 });
		}
		setOrderOptions(newOrderOptions);
	}, [inputTable]);

	const prepareInputForBackend = () => {
		return inputTable.map((column) => ({
			key: column.key,
			values: column.values.filter((value) => value.trim() !== "")
		}));
	};

	const handleSubmit = async () => {
		try {
			const filteredInput = showJsonInput
				? JSON.parse(jsonInput)
				: prepareInputForBackend();
			const formattedConstraints = stringInput
				.split(/\r?\n/) // Split the string into an array of lines
				.map((line) => line.trim()) // Trim each line
				.filter((line) => line.length > 0) // Remove empty lines
				.join(" "); // Join the lines back into a single string
			const result = await generateTestCases(
				JSON.stringify(filteredInput),
				formattedConstraints,
				orderValue
			);
			if (result && result.cases && Array.isArray(result.cases)) {
				setOutput(result.cases);
			} else {
				setOutput([]);
			}
			gaEvents.testGen();
		} catch (error) {
			console.error(error);
			setOutput([]);
		}
	};

	const handleInputChange = (e, rowIndex, colIndex) => {
		const newInputTable = [...inputTable];
		newInputTable[rowIndex].values[colIndex] = e.target.value;
		setInputTable(newInputTable);

		if (
			e.key === "Tab" &&
			rowIndex === Math.max(...inputTable.map((item) => item.values.length)) - 1
		) {
			e.preventDefault(); // Prevent focus from moving to the next control
			handleAddRow();
		}
	};

	const handleAddColumn = () => {
		setInputTable([...inputTable, { key: "", values: [] }]);
	};

	const handleAddValue = (rowIndex) => {
		const newInputTable = [...inputTable];
		newInputTable[rowIndex].values.push("");
		setInputTable(newInputTable);
	};

	const handleAddRow = () => {
		const newInputTable = [...inputTable];
		newInputTable.forEach((item) => item.values.push(""));
		setInputTable(newInputTable);
	};

	return (
		<Form>
			<Row className="mt-3 mb-5">
				<Col xs={2}>
					<h4>Order</h4>

					<Form.Select
						id="order"
						value={orderValue}
						onChange={(e) => setOrderValue(parseInt(e.target.value))}>
						{orderOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</Form.Select>
				</Col>
			</Row>
			<Row className="mt-3">
				<Col>
					<h4>Model</h4>
					<Button className="mb-3" onClick={toggleInputView}>
						{showJsonInput ? "Switch to Table Input" : "Switch to JSON Input"}
					</Button>
					{showJsonInput ? (
						<Form.Group controlId="jsonInput">
							<Form.Label>JSON Input</Form.Label>
							<Form.Control
								as="textarea"
								rows={10}
								value={jsonInput}
								onChange={(e) => setJsonInput(e.target.value)}
							/>
						</Form.Group>
					) : (
						<InputTable
							inputTable={inputTable}
							setInputTable={setInputTable}
							handleInputChange={handleInputChange}
							handleAddColumn={handleAddColumn}
							handleAddValue={handleAddValue}
							handleAddRow={handleAddRow}
						/>
					)}
				</Col>
			</Row>
			<Row className="mt-5">
				<Col>
					<h4>Constraints</h4>
					<Form.Group controlId="stringInput">
						<Form.Control
							as="textarea"
							rows={10}
							value={stringInput}
							onChange={(e) => setStringInput(e.target.value)}
						/>
					</Form.Group>
				</Col>
				{output.length > 0 && (
					<Col>
						<h4>JSON Output</h4>
						<Form.Group controlId="output">
							<Form.Control
								as="textarea"
								rows={10}
								readOnly
								value={JSON.stringify(output, null, 2)}
							/>
						</Form.Group>
					</Col>
				)}
			</Row>
			<Row className="mt-3 mb-5">
				<Col>
					<Button onClick={handleSubmit}>Generate Testcases</Button>
				</Col>
			</Row>
			<Row className="mt-3">
				{output.length > 0 && (
					<Col>
						<h4>Generated Testcases</h4>
						<OutputTable output={output} />
					</Col>
				)}
			</Row>
		</Form>
	);
};

export default InputForm;
