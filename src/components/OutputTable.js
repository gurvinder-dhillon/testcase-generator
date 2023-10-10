import React from "react";
import { Table } from "react-bootstrap";

const OutputTable = ({ output }) => {
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
		<Table striped bordered hover>
			{renderOutputTableHeader()}
			{renderOutputTableBody()}
		</Table>
	);
};

export default OutputTable;
