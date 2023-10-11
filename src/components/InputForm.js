import React, { useState } from "react";
import generateTestCases from "../utils/generateTestCases";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import InputTable from "./InputTable";
import OutputTable from "./OutputTable";

const InputForm = () => {
	const defaultJsonInput = [
		{
			key: "type",
			values: ["Primary", "Logical", "Single"]
		},
		{
			key: "Size",
			values: ["10", "100", "500", "1000", "5000", "10000", "40000"]
		},
		{
			key: "fileSystem",
			values: ["FAT", "FAT32", "NTFS"]
		}
	];

	const [jsonInput, setJsonInput] = useState(
		JSON.stringify(defaultJsonInput, null, 2)
	);

	const [showJsonInput, setShowJsonInput] = useState(false);

	const toggleInputView = () => {
		setShowJsonInput(!showJsonInput);
	};
	const [stringInput, setStringInput] = useState("");
	const [output, setOutput] = useState([]);
	const [inputTable, setInputTable] = useState(defaultJsonInput);

	const prepareInputForBackend = () => {
		return inputTable.map((column) => ({
			key: column.key,
			values: column.values.filter((value) => value.trim() !== "")
		}));
	};

	const handleSubmit = async () => {
		try {
			const filteredInput = prepareInputForBackend();
			const formattedConstraints = stringInput
				.split(/\r?\n/) // Split the string into an array of lines
				.map((line) => line.trim()) // Trim each line
				.filter((line) => line.length > 0) // Remove empty lines
				.join(" "); // Join the lines back into a single string
			const result = await generateTestCases(
				JSON.stringify(filteredInput),
				formattedConstraints
			);
			if (result && result.cases && Array.isArray(result.cases)) {
				setOutput(result.cases);
			} else {
				setOutput([]);
			}
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
		<Container>
			<Row className="mt-5">
				<Col>
					<Button className="mb-3" onClick={toggleInputView}>
						{showJsonInput ? "Switch to Table Input" : "Switch to JSON Input"}
					</Button>
					<h4>Model</h4>
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
						<h4>Output</h4>
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
			<Row className="mt-5">
				<Col>
					<OutputTable output={output} />
				</Col>
			</Row>
		</Container>
	);
};

export default InputForm;
