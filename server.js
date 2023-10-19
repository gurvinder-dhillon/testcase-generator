import express from "express";
import cors from "cors";
//const pictNode = require("pict-node");
import { pict, negative, strings, weight, alias } from "pict-node";

const app = express();
app.use(cors());
app.use(express.json());

function customReviver(key, value) {
	if (typeof value === "string") {
		if (value.startsWith("negative(")) {
			const argument = value.slice(9, -1); // Extract the argument from the string
			return negative(argument);
		} else if (value.startsWith("weight(")) {
			const argsString = value.slice(7, -1); // Extract the arguments from the string
			const [arg1, arg2] = argsString.split(", ").map((arg) => {
				if (!isNaN(arg)) {
					return parseInt(arg, 10);
				}
				return arg;
			});
			return weight(arg1, arg2);
		} else if (value.startsWith("alias(")) {
			const argsString = value.slice(6, -1); // Extract the arguments from the string
			const argsArray = JSON.parse(`[${argsString}]`); // Parse the arguments as an array
			return alias(argsArray);
		}
	}
	return value;
}

app.post("/generate-test-cases", async (req, res) => {
	try {
		const order = req.body.order;
		console.log("Order:", order);
		const inputString = req.body.inputString;
		console.log("UnParsed model:", req.body.model);

		const jsonArray = JSON.parse(
			req.body.model.replace(/(\r\n|\n|\r|\t)/gm, ""),
			customReviver
		);
		console.log(jsonArray);

		console.log("Parsed model:", jsonArray);
		console.log("Type of received model:", typeof jsonArray);
		let array;
		// Check if the parsed JSON object is an array
		// Parse the JSON string
		//const jsonObject = JSON.parse(jsonArray);
		const jsonObject = jsonArray;
		if (Array.isArray(jsonObject)) {
			// Assign the parsed JSON object to an array variable
			array = jsonObject;
			console.log("Type of array:", typeof array);
		} else {
			// Create a new array and iterate over the JSON object to add each element to the array
			array = [];
			for (const key in jsonObject) {
				const value = jsonObject[key];
				array.push(value);
			}
		}

		// Print the array
		console.log(array);
		let result;

		if (inputString.trim() !== "") {
			//const constraints = inputString.split("\n").join(" ");
			const constraints = inputString;
			console.log("Constraints:", constraints);
			console.log(negative("-1"));
			console.log(alias(["Win10", "Windows10", "WinWin"]));
			result = await strings(
				{
					model: array,
					constraints
				},
				{
					order: order,
					caseSensitive: true
				}
			);
		} else {
			console.log(negative("-1"));
			console.log(alias(["Win10", "Windows10", "WinWin"]));
			result = await pict(
				{ model: array },
				{
					order: order
				}
			);
		}

		//const cases = await pictNode.pict({ model: array });
		const cases = result;
		//console.log(cases);
		res.status(200).json({ cases });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ error: "An error occurred while generating test cases." });
	}
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
