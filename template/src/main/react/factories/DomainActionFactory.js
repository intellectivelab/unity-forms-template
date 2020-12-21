import React from "react";

import * as R from "ramda";

import {DefaultActionFactory, DefaultActionMapper, OneColumnLayout, resources} from '@intellective/core';
import {CreateApplicationAction} from "@intellective/forms";

import DomainViewApplicationAction from "../actions/DomainViewApplicationAction/DomainViewApplicationAction";

const defaultSettings = {
	fullScreen: true,
	margin: 'dense',
	innerMaxWidth: 'lg',
	maxWidth: 'xl',
	variant: 'dialog',
	Layout: OneColumnLayout
};

const DomainActionMapper = R.curry((settings = {}, action) => {
	return R.cond([
		[resources.isCreateCaseAction, R.always(CreateApplicationAction)],
		[resources.isViewAction, R.always(DomainViewApplicationAction(settings))]
	])(action);
});

export default function DomainActionFactory(config = defaultSettings) {
	DefaultActionFactory.call(this);

	this.createAction = R.curry((action, props) => {
		const {settings = {}, ...otherProps} = props;

		const {view: viewSettings = {}} = settings;

		const ActionComponent = DomainActionMapper({...config, ...viewSettings}, action) || DefaultActionMapper({...config, ...viewSettings}, action);

		return <ActionComponent {...otherProps} {...action} action={action}/>;
	});
}