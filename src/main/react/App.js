import React from 'react';

import {DefaultThemeProvider, FactoryContextProvider, PerspectiveContainer, registerBuilder} from '@intellective/core';

import _url from "url";

import DomainPalettes from "./themes/DomainPalettes";
import DomainThemeBuilder from "./themes/DomainThemeBuilder";

import DomainActionFactory from "./factories/DomainActionFactory";
import DomainComponentFactory from "./factories/DomainComponentFactory";
import DomainFormFieldFactory from "./factories/DomainFormFieldFactory";

import DomainPage from "./pages/DomainPage/DomainPage";
import DomainPageLayout from "./pages/DomainPage/DomainPageLayout";

const App = () => {
	const urlObj = _url.parse(window.location.search, true);
	const searchParams = urlObj.query;

	const searchParamsWithDefaultPerspective = {p: "internal", ...searchParams};
	const PageLayout = DomainPageLayout;

	return (
		<DefaultThemeProvider Builder={DomainThemeBuilder} Palettes={DomainPalettes} paletteName="connecticut">
			<FactoryContextProvider ActionFactory={new DomainActionFactory()}
			                        ComponentFactory={DomainComponentFactory}
			                        FormFieldFactory={DomainFormFieldFactory}
			>
				<PerspectiveContainer PageComponent={DomainPage}
				                      PageLayout={PageLayout}
				                      searchParams={searchParamsWithDefaultPerspective}
				                      href='./api/1.0.0/config/perspectives'
				/>
			</FactoryContextProvider>
		</DefaultThemeProvider>
	);
};

const constantMock = window.fetch;

window.fetch = function () {
	let secondArg = arguments[1] || {};
	secondArg.redirect = 'manual';
	arguments[1] = secondArg;

	return constantMock.apply(this, arguments).then(response => {
		if (response.type === 'opaqueredirect' && !response.ok) {
			alert("Your HTTP session appears to have been ended. " +
				"You will be redirected to the authentication page.");

			window.location.reload();
		}
		return response;
	});
};

export default App;
