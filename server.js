const express = require("express");
const cors = require("cors");
const pictNode = require("pict-node");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate-test-cases", async (req, res) => {
	try {
		console.log("UnParsed model:", req.body.model);

		const jsonArray = JSON.parse(
			req.body.model.replace(/(\r\n|\n|\r|\t)/gm, "")
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

		const cases = await pictNode.pict({ model: array });
		console.log(cases);
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
