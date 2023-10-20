import ReactGA from "react-ga4";

const testGen = () =>
	ReactGA.event("TestGen", {
		category: "TestGen",
		action: "Click",
		label: "TestGen"
	});

const gaEvents = {
	testGen
};

export default gaEvents;
