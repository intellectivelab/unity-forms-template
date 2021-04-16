import * as R from "ramda";

import {useSelector} from "react-redux";

export const FORMS_API_URL = "/forms-api/1.0.0";

export default (props) => {

	const {formId} = props;

	const formData = useSelector(R.path(["forms", formId, "data"]));

	const caseId = R.path(["caseId", "value"], formData);

	const formConfigId = R.path(["formConfigId", "value"], formData);
	const formVersionId = R.pathOr(formConfigId, ["EP_FormVersionID", "value"], formData);

	if (formVersionId) {
		return ({
			viewLink: FORMS_API_URL + `/config/forms/${formVersionId}`,
			modelLink: FORMS_API_URL + `/forms/${formVersionId}/${caseId}`
		});
	}

	return {};
};