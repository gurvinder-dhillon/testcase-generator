import React, { useState, useEffect } from "react";

import ReactMarkdown from "react-markdown";

const TestGenHelp = () => {
	const [markdownContent, setMarkdownContent] = useState("");

	useEffect(() => {
		fetch("/README.md")
			.then((response) => response.text())
			.then((text) => setMarkdownContent(text));
	}, []);

	return (
		<div>
			<ReactMarkdown>{markdownContent}</ReactMarkdown>
		</div>
	);
};

export default TestGenHelp;
