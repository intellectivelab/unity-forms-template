import React from 'react';

import {DefaultPerspectiveBuilder} from '@intellective/core';

import ExternalPage from "../pages/ExternalPage/ExternalPage";

export default (props) => <DefaultPerspectiveBuilder {...props} PageComponent={ExternalPage}/>;