import * as R from "ramda";

import {useDefaultFormFieldValidator} from "@intellective/core";

const useDomainFormFieldValidator = R.cond([
	[R.T, R.always(useDefaultFormFieldValidator)]
]);

export default useDomainFormFieldValidator;