import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.js";
import reportWebVitals from "./reportWebVitals.js";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactGA from "react-ga4";
//import * as ReactGAWrapper from "react-ga4";
//const ReactGA = ReactGAWrapper.default;
const TRACKING_ID = "G-X4LH9QYS8Q";

ReactGA.initialize(TRACKING_ID);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
