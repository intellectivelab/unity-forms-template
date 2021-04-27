import React from "react";

import * as R from "ramda";

import {DefaultComponentFactory} from "@intellective/core";

const DomainComponentFactory = R.cond([]);

export default (props) => DomainComponentFactory(props) || DefaultComponentFactory(props);