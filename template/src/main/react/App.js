import React from 'react';

import {DefaultThemeProvider, FactoryContextProvider, PerspectiveContainer} from '@intellective/core';

import {FormCtxt} from '@intellective/forms';

import _url from "url";

import DomainPalettes from "./themes/DomainPalettes";
import DomainThemeBuilder from "./themes/DomainThemeBuilder";

import DomainActionFactory from "./factories/DomainActionFactory";
import DomainComponentFactory from "./factories/DomainComponentFactory";
import DomainFormFieldFactory from "./factories/DomainFormFieldFactory";

import DomainPage from "./pages/DomainPage/DomainPage";

import useFormLinks from "./hooks/useFormLinks";
import useFormStatus from "./hooks/useFormStatus";

const App = () => {
	const urlObj = _url.parse(window.location.search, true);
	const searchParams = urlObj.query;

	const searchParamsWithDefaultPerspective = {p: "external", ...searchParams};

	return (
		<DefaultThemeProvider Builder={DomainThemeBuilder} Palettes={DomainPalettes} paletteName="epermit">
			<FactoryContextProvider ActionFactory={new DomainActionFactory()}
			                        ComponentFactory={DomainComponentFactory}
			                        FormFieldFactory={DomainFormFieldFactory}
			>
				<FormCtxt.Provider value={{useFormLinks, useFormStatus}}>
					<PerspectiveContainer PageComponent={DomainPage}
					                      searchParams={searchParamsWithDefaultPerspective}
					                      href='./api/1.0.0/config/perspectives'
					/>
				</FormCtxt.Provider>
			</FactoryContextProvider>
		</DefaultThemeProvider>
	);
};

const constantMock = window.fetch;

window.fetch = function () {
	let secondArg = arguments[1] || {};
	secondArg.redirect = 'manual';
	let args = [...arguments];
	args[1] = secondArg;

	return constantMock.apply(this, args).then(response => {
		if (response.type === 'opaqueredirect' && !response.ok) {
			window.location.reload();
		}
		return response;
	});
};

export default App;
