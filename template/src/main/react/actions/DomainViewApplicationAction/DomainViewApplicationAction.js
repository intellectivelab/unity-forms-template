import React, {useMemo} from "react";

import * as R from "ramda";

import {useFormLinks, useFormStatus, ViewApplicationAction} from "@intellective/forms";

import useDomainFormFieldValidator from "../../hooks/useDomainFormFieldValidator";

import {DOMAIN_API_URL} from "../../utils/integration";

const DomainViewApplicationAction = (settings) => (props) => {

	const onFormCompleteHandler = (formState) => {

		const caseType = R.path(["data", "caseType", "value"], formState);
		const caseId = R.path(["data", "caseId", "value"], formState);

		const submitLink = DOMAIN_API_URL + `/lifecycle/${caseType}/${caseId}/complete`;

		return fetch(submitLink, {method: 'POST'});
	};

	const ActionComponent = useMemo(() => ViewApplicationAction({...settings, useFormLinks, useFormStatus}), []);

	return (
		<ActionComponent {...props} validators={useDomainFormFieldValidator} onComplete={onFormCompleteHandler}/>
	);
};

export default DomainViewApplicationAction;