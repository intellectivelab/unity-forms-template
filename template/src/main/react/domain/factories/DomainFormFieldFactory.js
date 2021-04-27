import React from "react";

import * as R from "ramda";

import {DefaultFormFieldFactory, fields} from "@intellective/core";

import {ApplicationFieldFactory} from "@intellective/forms";

import FormTypeLookupField from "../components/FormTypeLookupField/FormTypeLookupField";
import DomainAttachmentField from "../components/AttachmentField/DomainAttachmentField";

const isFormTypeLookup = R.allPass([R.propEq('id', 'EP_FormID'), fields.isLookupField]);
const isAttachment = R.anyPass([R.propEq('type', 'attachment'), R.propEq('type', 'file')]);

const DomainFormFieldFactory = R.cond([
	[isFormTypeLookup, R.always(FormTypeLookupField)],
	[isAttachment, R.always(DomainAttachmentField)],
]);

export default (field) => DomainFormFieldFactory(field) || ApplicationFieldFactory(field) || DefaultFormFieldFactory(field);