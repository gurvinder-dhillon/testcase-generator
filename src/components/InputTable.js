import React from "react";
import {
	Table,
	InputGroup,
	FormControl,
	Button,
	OverlayTrigger,
	Tooltip
} from "react-bootstrap";
import {
	BsFillTrashFill,
	BsX,
	BsFillBackspaceFill
} from "react-icons/bs/index.esm.js";

const InputTable = ({
	inputTable,
	setInputTable,
	handleInputChange,
	handleAddColumn,
	handleAddValue,
	handleAddRow
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

	const handleDeleteRow = (rowIndex) => {
		const newInputTable = [...inputTable];
		newInputTable.forEach((item) => item.values.splice(rowIndex, 1));
		setInputTable(newInputTable);
	};

	const renderInputTableFooter = () => {
		return (
			<tfoot>
				<tr>
					{inputTable.map((_, index) => (
						<td key={index}></td>
					))}
					<td>
						<Button onClick={handleAddColumn}>Add Parameter</Button>
					</td>
					<td>
						<Button onClick={handleAddRow}>Add Value</Button>
					</td>
				</tr>
			</tfoot>
		);
	};

	const renderInputTableHeader = () => {
		return (
			<thead>
				<tr>
					<th>#</th>
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
					<td>{i + 1}</td>
					{inputTable.map((item, colIndex) => (
						<td key={colIndex}>
							<InputGroup>
								<FormControl
									value={item.values[i] || ""}
									onChange={(e) => handleInputChange(e, colIndex, i)}
									onKeyDown={(e) => {
										if (
											e.key === "Enter" &&
											i ===
												Math.max(
													...inputTable.map((item) => item.values.length)
												) -
													1
										) {
											e.preventDefault();
											handleAddRow();
										}
									}}
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
							</InputGroup>
						</td>
					))}
					<td>
						<OverlayTrigger
							placement="top"
							overlay={<Tooltip id={`tooltip-top`}>Delete Row</Tooltip>}>
							<Button
								variant="outline-danger"
								onClick={() => handleDeleteRow(i)}>
								<BsFillBackspaceFill />
							</Button>
						</OverlayTrigger>
					</td>
				</tr>
			);
		}

		return <tbody>{rows}</tbody>;
	};

	return (
		<>
			<Table striped="columns" bordered hover responsive>
				{renderInputTableHeader()}
				{renderInputTableBody()}
			</Table>
			<div className="mt-1">
				<Button className="me-3" onClick={handleAddColumn}>
					Add Parameter
				</Button>
				<Button onClick={handleAddRow}>Add Value</Button>
			</div>
		</>
	);
};

export default InputTable;
