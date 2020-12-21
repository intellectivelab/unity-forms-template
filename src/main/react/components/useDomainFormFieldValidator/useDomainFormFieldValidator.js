import * as R from "ramda";

import MelissaAddressValidator from "../MelissaAddressValidator/MelissaAddressValidator";

export default R.cond([
	[R.propEq('type', 'address'), R.always(MelissaAddressValidator)],
]);