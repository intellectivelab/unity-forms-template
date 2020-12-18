import {useEffect, useReducer} from "react";

import * as R from "ramda";

import {useSelector} from "react-redux";

import {checkStatus} from "@intellective/core";

import {DEEP_API_URL} from "../../utils/integration";

const AFFILIATIONS_CONFIG_URL = DEEP_API_URL + '/config/affiliations';
const AFFILIATIONS_DATA_URL_TEMPLATE = DEEP_API_URL + '/affiliations/';

const extractValue = (value) => R.when(R.is(Object), R.prop("value"))(value.value);

const formatAffiliationsData = (config, rawData) => {
    const addressMapper = address => (address.line1 + "\n" + address.city + ", " + address.state + "\n" + address.zipCode + ", " + address.country);

    const prepareAddresses = R.compose(R.join(','), R.map(addressMapper));

    const phoneMapper = phone => (phone.number + (phone.ext ? " ext " + phone.ext : ""));

    const preparePhones = R.compose(R.join(','), R.map(phoneMapper));

    const contactMapper = contact => (contact.name + "\n" + preparePhones(contact.phoneList) + "\n" + contact.email + " " + prepareAddresses(contact.addressList || []));

    const prepareContacts = R.compose(R.join(','), R.map(contactMapper));

    const data = R.defaultTo([], R.prop("clientList", rawData));

    return (
        R.map((item) => {
            const {required, affiliationTypeCode, affiliationTypeDesc} = item;

            const clientMapper = client => client?.affiliationControl?.affiliationTypeDesc === affiliationTypeDesc ||
                client?.affiliationControl?.affiliationTypeCode === affiliationTypeCode;

            const clientData = data.find(clientMapper);

            if (clientData) {
                const {firstName, lastName, affiliationControl = {}, addressList = [], phoneList = [], contactList = []} = clientData;

                return {
                    type: affiliationControl.affiliationTypeDesc,
                    name: R.join(" ", [lastName, firstName]),
                    address: prepareAddresses(addressList),
                    phone: preparePhones(phoneList),
                    contact: prepareContacts(contactList),
                    complete: true
                };
            }

            return {
                type: affiliationTypeDesc,
                complete: !required
            };
        }, config)
    );
};

const START_LOADING = "START_LOADING";
const CLEAR_DATA = "CLEAR_DATA";
const SET_DATA = "SET_DATA";

const reducer = (state, action) => {
    switch (action.type) {
        case START_LOADING: {
            return {...state, loading: true};
        }
        case CLEAR_DATA: {
            return {affiliationId: state.affiliationId, loading: false};
        }
        case SET_DATA: {
            const {config, rawData = {}} = action;
            return {...state, loading: false, data: formatAffiliationsData(config, rawData)};
        }
    }

    return state;
};

export default (props) => {
    const onError = props.onError || console.log;

    const formData = useSelector(R.path(["forms", props.formId, "data"]));

    const params = R.pipe(
        R.pick(['EP_AffiliationID', 'EP_Program', 'EP_EnvIntTypeCode']),
        R.map(extractValue),
        (obj) => ({programCode: obj.EP_Program, programCodeEIType: obj.EP_EnvIntTypeCode, affiliationId: obj.EP_AffiliationID})
    )(formData);

    const {programCode, programCodeEIType, affiliationId} = params;

    const [state, dispatch] = useReducer(reducer, {affiliationId});

    const getAffiliationsConfig = (programCode, envIntTypeCode) => (
        fetch(AFFILIATIONS_CONFIG_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({programCode, envIntTypeCode})
        })
            .then(checkStatus)
            .then(response => (response._embedded || {}).affiliationConfigList || [])
    );

    const getAffiliationsData = (affiliationId) => (config) => {
        if (affiliationId) {
            fetch(AFFILIATIONS_DATA_URL_TEMPLATE + affiliationId)
                .then(checkStatus)
                .then(response => dispatch({type: SET_DATA, config, rawData: response}));
        } else {
            dispatch({type: SET_DATA, config});
        }
    };

    useEffect(() => {
        if (programCode && programCodeEIType) {
            dispatch({type: START_LOADING});
            getAffiliationsConfig(programCode, programCodeEIType)
                .then(getAffiliationsData(affiliationId))
                .catch(onError);
        } else {
            if (state.data) {
                dispatch({type: CLEAR_DATA});
            }
        }
    }, [programCode, programCodeEIType, affiliationId]);

    return state;
};