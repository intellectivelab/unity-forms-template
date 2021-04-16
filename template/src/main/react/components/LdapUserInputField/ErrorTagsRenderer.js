import React from "react";

import {AutocompleteTagsRenderer} from "@intellective/core";

import ErrorOptionTag from "./ErrorOptionTag";

export default (props) => AutocompleteTagsRenderer({...props, OptionTag: ErrorOptionTag});