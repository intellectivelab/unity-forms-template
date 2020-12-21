import * as R from "ramda";

export const FORMS_API_URL = "/forms-api";

export default (props) => {

	const {selected = {}} = props;

	const caseId = selected.id;
	const formConfigId = R.pathOr(R.prop("EP_FormVersionID", selected), ["EP_FormVersionID", "value"])(selected);

	if (formConfigId) {
		return ({
			viewLink: FORMS_API_URL + `/config/forms/${formConfigId}`,
			modelLink: FORMS_API_URL + `/forms/${formConfigId}/${caseId}`
		});
	}

	return {};
};