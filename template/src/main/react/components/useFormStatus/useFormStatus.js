import * as R from "ramda";

export default (data) => {
	const status = R.pathOr(R.path(["EP_Status", "value"], data), ["EP_Status", "value", "value"], data);

	const isDraft = R.equals("Draft", status);

	return {status, isDraft};
};