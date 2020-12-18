import React, {useMemo} from "react";

import * as R from "ramda";

import {ViewApplicationAction} from "@intellective/forms";

import useFormLinks from "../../components/useFormLinks/useFormLinks";
import useFormStatus from "../../components/useFormStatus/useFormStatus";
import useDomainFormFieldValidator from "../../components/useDomainFormFieldValidator/useDomainFormFieldValidator";

import {DEEP_API_URL} from "../../utils/integration";

export default (settings) => (props) => {

	const onFormCompleteHandler = (formState) => {

		const caseType = R.path(["data", "caseType", "value"], formState);
		const caseId = R.path(["data", "caseId", "value"], formState);

		const completeLink = DEEP_API_URL + `/lifecycle/${caseType}/${caseId}/complete`;

		return fetch(completeLink, {method: 'POST'});
	};

	const ActionComponent = useMemo(() => ViewApplicationAction({...settings, useFormLinks, useFormStatus}), []);

	return (
		<ActionComponent {...props} validators={useDomainFormFieldValidator} onComplete={onFormCompleteHandler}/>
	);
};