import React from "react";

import {DefaultOptionTag} from "@intellective/core";

export const ErrorAwareOptionTag = (props) => {
    const {option} = props;

    if (option && option.invalid) {
        return <DefaultOptionTag {...props} color='secondary' backgroundColor='red' />;
    }

    return <DefaultOptionTag {...props}/>;
};