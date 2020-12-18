import React from "react";

import * as R from "ramda";

import {Box, Hidden} from "@material-ui/core";

import ExternalProfile from "../../containers/ExternalProfile/ExternalProfile";
import PdfHelpWidget from "../../containers/HelpWidget/HelpWidget";

const userInfo = (
	<Hidden xsDown>
		<Box display="flex" flexWrap="noWrap" alignItems="center">
			<Box mx={1}>
				<PdfHelpWidget filename="help.external.pdf"/>
			</Box>
			<Box mx={1}>
				<ExternalProfile/>
			</Box>
		</Box>
	</Hidden>
);

export default R.curry((WrappedComponent, props) => (<WrappedComponent {...props} userInfo={userInfo}/>));