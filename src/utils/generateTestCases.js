import axios from "axios";

const generateTestCases = async (jsonInput, stringInput) => {
	const model = [
		{
			key: "location",
			values: ["Ukraine", "Poland", "Lithuania", "Germany", "USA"]
		},
		{
			key: "customer",
			values: ["Individuals", "Companies", "Partners"]
		},
		{
			key: "time",
			values: ["05:00", "11:99", "15:00", "21:30", "23:59"]
		},
		{
			key: "paymentSystem",
			values: ["VISA", "MasterCard", "PayPal", "WebMoney", "Qiwi"]
		},
		{
			key: "product",
			values: [
				{
					id: 1732
				},
				{
					id: 319
				},
				{
					id: 872
				},
				{
					id: 650
				}
			]
		},
		{
			key: "discount",
			values: [true, false]
		}
	];

	try {
		const response = await axios.post(
			"http://localhost:3001/generate-test-cases",
			{
				model: jsonInput,
				inputString: stringInput
			}
		);

		if (response && response.data && response.data.cases) {
			return response.data;
		} else {
			return { cases: [] };
		}
	} catch (error) {
		console.error(error);
		return { cases: [] };
	}
};

export default generateTestCases;
