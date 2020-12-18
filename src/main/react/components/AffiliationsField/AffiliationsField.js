import React, {useEffect} from "react";

import * as R from "ramda";

import {useDispatch, useSelector} from "react-redux";

import withStyles from "@material-ui/core/styles/withStyles";

import {forms, TableView} from "@intellective/core";

import {CommonSubmitAction} from "@intellective/forms";

import AffiliationsList from "./AffiliationsList";
import useAffiliationsLoader from "./useAffiliationsLoader";

import styles from "./styles";

import {DEEP_API_URL} from "../../utils/integration";

const useAlwaysEnabledState = (props) => {
	const {formId} = props;

	const formState = useSelector(({forms}) => R.defaultTo({})(forms[formId]));

	const {data = {}} = formState;

	const values = R.values(data);
	const updated = R.any(value => value.updated === true)(values);

	return {formState, updated};
};

const AlwaysEnabledSaveCaseAction = (props) => <CommonSubmitAction {...props} useFormState={useAlwaysEnabledState}/>;

const useAffiliationsValidator = (props) => {
	const {formId, data} = props;

	const affiliationsPopulated = useSelector(R.path(["forms", formId, 'affiliationsPopulated']));

	const dispatch = useDispatch();

	const isDataCorrect = Boolean(data && R.not(R.any(R.propEq('complete', false))(data)));

	useEffect(() => {
		if (!R.equals(affiliationsPopulated, isDataCorrect)) {
			dispatch(forms.updateFormState(formId, {
				affiliationsPopulated: isDataCorrect
			}));
		}
	}, [isDataCorrect]);
};

const DEFAULT_TITLE = "Companies/Entities/Individuals Associated with this filing";

const AffiliationsField = (props) => {
	const {readOnly, selected = {}, title = DEFAULT_TITLE} = props;

	const {caseType, caseId} = selected;

	const {loading, affiliationId, data} = useAffiliationsLoader(props);

	//TODO uncomment when issue with '=' will be fixed
	//useAffiliationsValidator({...props, data});

	const redirect = () => {
		window.location.href = DEEP_API_URL + `/redirect/affiliations/${caseType}/${caseId}`;
	};

	return (
		<AffiliationsList
			disableActions={readOnly || loading || !data}
			ListView={TableView}
			setupActions={[
				<AlwaysEnabledSaveCaseAction {...props} key="editAction" label={affiliationId ? "Edit" : "Create"} onSuccess={redirect}/>
			]}
			title={title}
			useDataLoader={R.always({data, loading})}
		/>
	);
};

export default withStyles(styles)(AffiliationsField);