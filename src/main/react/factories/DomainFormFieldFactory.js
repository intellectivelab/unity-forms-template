import React from "react";

import * as R from "ramda";

import {DefaultFormFieldFactory, fields} from "@intellective/core";
import {AddressField, AttachmentField, ParagraphField} from "@intellective/forms";

import AffiliationsField from "../components/AffiliationsField/AffiliationsField";
import FormTypeLookupField from "../components/FormTypeLookupField/FormTypeLookupField";
import LdapUserInputField from "../components/LdapUserInputField/LdapUserInputField";

const DomainFormFieldFactory = R.cond([
	[R.propEq('type', 'address'), R.always(AddressField)],
	[R.propEq('type', 'paragraph'), R.always(ParagraphField)],
	[R.anyPass([R.propEq('type', 'attachment'), R.propEq('type', 'file')]), R.always(AttachmentField)],
	[R.allPass([fields.isLookupField, R.propEq('id', 'EP_FormID')]), R.always(FormTypeLookupField)],
	[R.anyPass([R.propEq('id', 'EP_AdditionalSubmitter'), R.propEq('id', 'EP_Reviewer')]), R.always(LdapUserInputField)],
	[R.anyPass([R.propEq('id', 'EP_AffiliationID'), R.propEq('ui', 'affiliations')]), R.always(AffiliationsField)],
]);

export default (field) => DomainFormFieldFactory(field) || DefaultFormFieldFactory(field);