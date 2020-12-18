import React, {useEffect} from "react";
import * as R from "ramda";

import {AutocompleteField, checkStatus} from "@intellective/core";
import ErrorAwareInputTagsRenderer from "./ErrorAwareInputTagsRenderer";
import {DEEP_API_URL} from "../../utils/integration";

const verifyAndUpdate = (username) => {
    const formatUser = userInfo => {
        const {valid, firstName, lastName} = userInfo;
        return valid ? {name: `${firstName} ${lastName} (${username})`, value: username}
            : {name: "Invalid user " + username, value: username, invalid: true};
    };

    if (username && username.name) {
        return new Promise((resolve) => resolve(username));
    }

    return fetch(DEEP_API_URL + `/user-info/verify/${username}`)
        .then(checkStatus)
        .then(formatUser);
};

export default (props) => {
    const {multiValue, value, onChange = R.identity} = props;

    useEffect(() => {
        if (!R.isNil(value) && !R.isEmpty(value)) {
            const promise = multiValue ? Promise.all(value.map(verifyAndUpdate)) : verifyAndUpdate(value);
            promise.then(onChange).catch(R.identity);
        }
    }, []);

    const singleValueChangeHandler = (newValue) => {
        if (R.not(R.equals(value, newValue))) {
            verifyAndUpdate(newValue)
                .then(onChange)
                .catch(() => {
                    onChange(newValue);
                });
        }
    };

    const multiValueChangeHandler = (newValue) => {
        if (newValue.length > value.length) {
            verifyAndUpdate(R.last(newValue))
                .then(valueObj => onChange(R.update(-1, valueObj, newValue)))
                .catch(() => {
                    onChange(newValue);
                });
        } else {
            onChange(newValue);
        }
    };

    return <AutocompleteField {...props}
                              onChange={multiValue ? multiValueChangeHandler : singleValueChangeHandler}
                              TextInputTagsRenderer={ErrorAwareInputTagsRenderer}/>;
};