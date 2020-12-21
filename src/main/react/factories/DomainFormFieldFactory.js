import React from "react";

import * as R from "ramda";

import {DefaultFormFieldFactory, fields} from "@intellective/core";

import FormTypeLookupField from "../components/FormTypeLookupField/FormTypeLookupField";

const DomainFormFieldFactory = R.cond([
	[R.allPass([fields.isLookupField, R.propEq('id', 'EP_FormID')]), R.always(FormTypeLookupField)],
]);

export default (field) => DomainFormFieldFactory(field) || DefaultFormFieldFactory(field);