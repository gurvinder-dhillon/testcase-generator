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
			key: "size",
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
	const [stringInput, setStringInput] = useState("");
	const [output, setOutput] = useState([]);
	const [inputTable, setInputTable] = useState(defaultJsonInput);

	const handleSubmit = async () => {
		try {
			const result = await generateTestCases(
				JSON.stringify(inputTable),
				stringInput
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
	};

	const handleAddColumn = () => {
		setInputTable([...inputTable, { key: "", values: [] }]);
	};

	const handleAddValue = (rowIndex) => {
		const newInputTable = [...inputTable];
		newInputTable[rowIndex].values.push("");
		setInputTable(newInputTable);
	};

	return (
		<Container>
			<Row className="mt-5">
				<Col>
					<Form.Group controlId="jsonInput">
						<Form.Label>JSON Input</Form.Label>
						<Form.Control
							as="textarea"
							rows={10}
							value={jsonInput}
							onChange={(e) => setJsonInput(e.target.value)}
						/>
					</Form.Group>
				</Col>
				<Col>
					<Form.Group controlId="stringInput">
						<Form.Label>String Input</Form.Label>
						<Form.Control
							as="textarea"
							rows={10}
							value={stringInput}
							onChange={(e) => setStringInput(e.target.value)}
						/>
					</Form.Group>
				</Col>
				<Col>
					<Form.Group controlId="output">
						<Form.Label>Output</Form.Label>
						<Form.Control
							as="textarea"
							rows={10}
							readOnly
							value={JSON.stringify(output, null, 2)}
						/>
					</Form.Group>
				</Col>
			</Row>
			<Row className="mt-3 mb-5">
				<Col>
					<Button onClick={handleSubmit}>Submit</Button>
				</Col>
			</Row>
			<Row>
				<Col>
					<InputTable
						inputTable={inputTable}
						setInputTable={setInputTable}
						handleInputChange={handleInputChange}
						handleAddColumn={handleAddColumn}
						handleAddValue={handleAddValue}
					/>
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
