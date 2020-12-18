import {useEffect, useState} from "react";
import * as R from "ramda";

const valueIsInvalid = value => value && value.invalid;

export default (inputRef, value, props = {}) => {
    const [validationState, updateValidationState] = useState({error: false});

    useEffect(() => {
        const error = Array.isArray(value) ? R.any(valueIsInvalid)(value) : valueIsInvalid(value);
        const errorText = error ? "The field has invalid users" : undefined;

        if (!R.equals(validationState.error, error) || !R.equals(validationState.errorText, errorText)) {
            updateValidationState({error, errorText});
        }
    }, [value]);

    return validationState;
};