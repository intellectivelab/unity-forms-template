import React, {useEffect, useState} from "react";

import * as R from "ramda";

import {useSelector} from "react-redux";

import {checkStatus, debounce} from "@intellective/core";

import {DOMAIN_API_URL} from "../utils/integration";

const DEEP_API_MELISSA_URL = DOMAIN_API_URL + "/melissa/verify";

const debouncedCallMelissaValidation = debounce((addressObj, onSuccess, onError) => {
	fetch(DEEP_API_MELISSA_URL, {
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(addressObj),
	}).then(checkStatus).then((response) => {
		onSuccess(response);
	}).catch(onError);
}, 1000);

const checkEmptyFields = (fields, values) =>
	(R.any(field => field.required && values[field.name] === undefined)(fields));

const useMelissaAddressValidator = (inputRef, value = {}, field = {}) => {
	const {formId, id, fields = []} = field;

	const fieldData = useSelector(R.pathOr({}, ["forms", formId, "data", id]));

	const {locationOff = false} = fieldData;

	const incomplete = checkEmptyFields(fields, value);

	const [validationResult, updateValidationResult] = useState({error: incomplete});

	useEffect(() => {
		if (R.isEmpty(value) || incomplete) {
			return validationResult;
		}

		if (locationOff) {
			updateValidationResult({error: false, errorText: undefined});
			return;
		}

		updateValidationResult(state => R.mergeRight(state, {processing: true}));

		debouncedCallMelissaValidation(value, (response) => {
				const {serviceCode, serviceDesc, valid, ...addressResponse} = response;
				updateValidationResult({processing: false, error: !valid, errorText: serviceDesc, response: addressResponse});
			},
			error => updateValidationResult({processing: false, error: true, errorText: error.message})
		);

	}, [locationOff, value]);

	return validationResult;
};

export default useMelissaAddressValidator;