import * as R from "ramda";

export default (resourceData) => {
	const status =
		R.path(["fields", "EP_Status", "value"], resourceData) ??
		R.path(["fields", "EP_Status"], resourceData) ??
		R.path(["EP_Status", "value", "value"], resourceData) ??
		R.path(["EP_Status", "value"], resourceData);

	const isDraft = R.equals("Draft", status);

	return {status, isDraft};
};