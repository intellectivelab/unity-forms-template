import React from "react";

import {AutocompleteOptionTag} from "@intellective/core";

const ErrorOptionTag = (props) => {
	const {option} = props;

	if (option && option.invalid) {
		return <AutocompleteOptionTag {...props} color='secondary' backgroundColor='red'/>;
	}

	return <AutocompleteOptionTag {...props}/>;
};

export default ErrorOptionTag;