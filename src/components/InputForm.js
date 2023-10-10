import React, { useState } from "react";
import generateTestCases from "../utils/generateTestCases";
import {
	Container,
	Row,
	Col,
	Form,
	Button,
	Table,
	InputGroup,
	FormControl
} from "react-bootstrap";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

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

	const renderInputTableHeader = () => {
		return (
			<thead>
				<tr>
					{inputTable.map((item, index) => (
						<th key={index}>
							<InputGroup>
								<FormControl
									placeholder="Key"
									value={item.key}
									onChange={(e) => {
										const newInputTable = [...inputTable];
										newInputTable[index].key = e.target.value;
										setInputTable(newInputTable);
									}}
								/>
							</InputGroup>
						</th>
					))}
					<th>
						<Button onClick={handleAddColumn}>Add Column</Button>
					</th>
				</tr>
			</thead>
		);
	};

	const renderInputTableBody = () => {
		const maxRows = Math.max(...inputTable.map((item) => item.values.length));

		const rows = [];
		for (let i = 0; i < maxRows; i++) {
			rows.push(
				<tr key={i}>
					{inputTable.map((item, colIndex) => (
						<td key={colIndex}>
							<InputGroup>
								<FormControl
									value={item.values[i] || ""}
									onChange={(e) => handleInputChange(e, colIndex, i)}
								/>
							</InputGroup>
						</td>
					))}
				</tr>
			);
		}

		return <tbody>{rows}</tbody>;
	};

	const renderOutputTableHeader = () => {
		if (output.length === 0) return null;

		const headerKeys = Object.keys(output[0]);
		return (
			<thead>
				<tr>
					{headerKeys.map((key, index) => (
						<th key={index}>{key}</th>
					))}
				</tr>
			</thead>
		);
	};

	const renderOutputTableBody = () => {
		return (
			<tbody>
				{output.map((item, index) => (
					<tr key={index}>
						{Object.values(item).map((value, i) => (
							<td key={i}>{value}</td>
						))}
					</tr>
				))}
			</tbody>
		);
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
					<Table striped bordered hover>
						{renderInputTableHeader()}
						{renderInputTableBody()}
					</Table>
				</Col>
			</Row>
			<Row className="mt-5">
				<Col>
					<Table striped bordered hover>
						{renderOutputTableHeader()}
						{renderOutputTableBody()}
					</Table>
				</Col>
			</Row>
		</Container>
	);
};

export default InputForm;
