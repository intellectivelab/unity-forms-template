import React from "react";
import * as R from "ramda";

import Tooltip from "@material-ui/core/Tooltip";
import withStyles from "@material-ui/styles/withStyles";

import {GridView, useDefaultColumnRenderer, withSnackbar} from "@intellective/core";

const ErrorTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.error.main,
        color: 'rgba(255, 255, 255, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}))(Tooltip);

const withAffiliationsColumns = R.curry((WrappedComponent, props) => {

    const firstColumnRenderer = (value, row, column) => {
        const defaultRenderer = useDefaultColumnRenderer(column);
        if (row['complete']) {
            return defaultRenderer(value, row);
        } else {
            return (
                <ErrorTooltip title="Required" placement="left">
                    <div style={{color: 'red'}}>
                        {defaultRenderer(value, row)}
                    </div>
                </ErrorTooltip>
            );
        }
    };

    const affiliationsColumns = [
        //{name: 'expander', renderer: expanderRenderer},
        {dataType: "string", label: "Affiliation", name: "type", renderer: firstColumnRenderer},
        {dataType: "string", label: "Name", name: "name"},
        {dataType: "string", label: "Mailing Address", name: "address"},
        {dataType: "string", label: "Business Phone", name: "phone"},
        {dataType: "string", label: "Contact", name: "contact"}
    ];

    return <WrappedComponent {...props} columns={affiliationsColumns}/>;
});

export default R.compose(withSnackbar, withAffiliationsColumns)(GridView);