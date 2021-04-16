import * as R from "ramda";

import useMelissaAddressValidator from "./useMelissaAddressValidator";

export default R.cond([
	[R.propEq('type', 'address'), R.always(useMelissaAddressValidator)],
]);