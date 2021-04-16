import React, {useEffect} from "react";

import * as R from "ramda";

import {AutocompleteField, checkStatus} from "@intellective/core";

import ErrorTagsRenderer from "./ErrorTagsRenderer";

import {DOMAIN_API_URL} from "../../utils/integration";

const verifyAndUpdate = (inputValue) => {
    const formatUser = userInfo => {
        const {valid, firstName, lastName, userId, userName} = userInfo;

        return valid ? {name: `${firstName} ${lastName} (${userName})`, value: userId}
            : {name: "Invalid user " + inputValue, value: inputValue, invalid: true};
    };

    if (inputValue && inputValue.name) {
        return new Promise((resolve) => resolve(inputValue));
    }

    return fetch(DOMAIN_API_URL + `/user-info/verify/${inputValue}`)
        .then(checkStatus)
        .then(formatUser);
};

export default (props) => {
	const {multiValue, value, onChange = R.identity} = props;

	useEffect(() => {
		if (!R.isNil(value) && !R.isEmpty(value)) {
			const promise = multiValue ? Promise.all(value.map(verifyAndUpdate)) : verifyAndUpdate(value);

			promise.then(onChange).catch(R.identity);
		}
	}, []);

	const singleValueChangeHandler = (newValue) => {
		if (R.not(R.equals(value, newValue))) {
			verifyAndUpdate(newValue)
				.then(onChange)
				.catch(() => {
					onChange(newValue);
				});
		}
	};

	const multiValueChangeHandler = (newValue) => {
		if (newValue.length > value.length) {
			verifyAndUpdate(R.last(newValue))
				.then(valueObj => onChange(R.update(-1, valueObj, newValue)))
				.catch(() => {
					onChange(newValue);
				});
		} else {
			onChange(newValue);
		}
	};

	const onChangeHandler = multiValue ? multiValueChangeHandler : singleValueChangeHandler;

	return <AutocompleteField {...props} TagsRenderer={ErrorTagsRenderer} onChange={onChangeHandler}/>;
};