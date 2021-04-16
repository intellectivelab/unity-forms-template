import React from "react";

import {AttachmentField} from "@intellective/forms";

const getDropZoneMessage = (allowedExtensions) => {
	if (allowedExtensions.includes('zip')) {
		return 'Drop files to attach, or click to browse. ZIP format is required';
	}

	return 'Drop files to attach, or click to browse. PDF/A format preferred';
};

const useDefaultApplicationFolder = () => "Application";

const DomainAttachmentField = (props) => {

	const {allowedExtensions} = props;

	return (
		<AttachmentField {...props}
		                 dropZoneMessage={getDropZoneMessage(allowedExtensions)}
		                 useDefaultFolder={useDefaultApplicationFolder}/>
	);
};

export default DomainAttachmentField;