import React from "react";
import * as R from "ramda";

import {useConfigLoader} from "@intellective/core";

import {DEEP_API_URL} from "../../utils/integration";

export default R.curry((WrappedField, props) => {

    const {data = {}} = useConfigLoader(DEEP_API_URL + "/user-info");

    return (
        <WrappedField {...props} user={data}/>
    );
});