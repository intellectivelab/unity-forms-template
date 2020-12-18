import * as R from "ramda";

import MelissaAddressValidator from "../MelissaAddressValidator/MelissaAddressValidator";
import UserFieldValidator from "../LdapUserInputField/UserFieldValidator";

export default R.cond([
	[R.propEq('type', 'address'), R.always(MelissaAddressValidator)],
	[R.anyPass([R.propEq('id', 'EP_AdditionalSubmitter'), R.propEq('id', 'EP_Reviewer')]), R.always(UserFieldValidator)]
]);