import React from "react";

import * as R from "ramda";

import {useDispatch} from "react-redux";

import {forms, LookupField} from "@intellective/core";

const FIELD_NAMES = [
	//'EP_ApplicationType',
	'EP_AssignedGroup',
	'EP_Bureau',
	'EP_EnvIntTypeCode',
	'EP_FormVersionID',
	'EP_Program',
	'EP_SupervisionRequired'
];

export default (props) => {
	const {formId} = props;

	const dispatch = useDispatch();

	const clearData = () => (R.reduce((acc, name) => ({...acc, [name]: {value: null, updated: true}}), {}, FIELD_NAMES));

	const populateData = (field) => {
		const picked = R.pick(FIELD_NAMES, field);

		const buildValue = (value, key) => {
			return R.cond([
				[R.equals('EP_Program'), R.always({name: value, value: field.program_code || value})],
				[R.equals('EP_Bureau'), R.always({name: value, value: field.bureau_id || value})],
				[R.T, R.always(value)]
			])(key);
		};

		const stateFormat = (value, key) => ({value: buildValue(value, key), updated: true});
		return R.mapObjIndexed(stateFormat, picked);
	};

	const onSelect = (field) => {
		const data = R.isNil(field) ? clearData() : populateData(field);

		dispatch(forms.updateFormState(formId, { data: data }));
	};

	return <LookupField {...props} onSelect={onSelect}/>;
};