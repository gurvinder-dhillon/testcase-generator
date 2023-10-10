import React from "react";
import { Table, InputGroup, FormControl, Button } from "react-bootstrap";

const InputTable = ({
	inputTable,
	setInputTable,
	handleInputChange,
	handleAddColumn,
	handleAddValue
}) => {
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

	return (
		<Table striped bordered hover>
			{renderInputTableHeader()}
			{renderInputTableBody()}
		</Table>
	);
};

export default InputTable;
