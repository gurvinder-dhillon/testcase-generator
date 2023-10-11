import React from "react";
import {
	Table,
	InputGroup,
	FormControl,
	Button,
	OverlayTrigger,
	Tooltip
} from "react-bootstrap";
import { BsFillTrashFill, BsX, BsFillBackspaceFill } from "react-icons/bs";

const InputTable = ({
	inputTable,
	setInputTable,
	handleInputChange,
	handleAddColumn,
	handleAddValue
}) => {
	const handleRemoveColumn = (colIndex) => {
		const newInputTable = [...inputTable];
		newInputTable.splice(colIndex, 1);
		setInputTable(newInputTable);
	};

	const handleClearCell = (rowIndex, colIndex) => {
		const newInputTable = [...inputTable];
		newInputTable[colIndex].values[rowIndex] = "";
		setInputTable(newInputTable);
	};

	const handleDeleteCell = (rowIndex, colIndex) => {
		const newInputTable = [...inputTable];
		newInputTable[colIndex].values.splice(rowIndex, 1);
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

								<OverlayTrigger
									placement="top"
									overlay={<Tooltip id={`tooltip-top`}>Remove Column</Tooltip>}>
									<Button
										variant="outline-danger"
										onClick={() => handleRemoveColumn(index)}>
										<BsFillTrashFill />
									</Button>
								</OverlayTrigger>
							</InputGroup>
						</th>
					))}
					<th>
						<Button onClick={handleAddColumn}>Add Parameter</Button>
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

								<OverlayTrigger
									placement="top"
									overlay={<Tooltip id={`tooltip-top`}>Clear Cell</Tooltip>}>
									<Button
										variant="outline-secondary"
										onClick={() => handleClearCell(i, colIndex)}>
										<BsX />
									</Button>
								</OverlayTrigger>
								<OverlayTrigger
									placement="top"
									overlay={<Tooltip id={`tooltip-top`}>Delete Cell</Tooltip>}>
									<Button
										variant="outline-danger"
										onClick={() => handleDeleteCell(i, colIndex)}>
										<BsFillBackspaceFill />
									</Button>
								</OverlayTrigger>
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
