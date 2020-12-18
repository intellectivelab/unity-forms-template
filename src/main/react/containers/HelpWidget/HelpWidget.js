import React, {useState} from "react";

import {IconButton, lighten, withStyles} from "@material-ui/core";

import HelpIcon from "@material-ui/icons/HelpOutlined";

import {DefaultViewTitle, DialogViewPort} from "@intellective/core";

import PdfViewer from "./PdfViewer";

const styles = theme => ({
	headerLink: {
		color: lighten(theme.palette.primary.main, .5),
	}
});

export default withStyles(styles)((props) => {
    const {classes, filename, title = "Help"} = props;

    const [open, setOpen] = useState(false);

    return (
        <>
            <IconButton className={classes.headerLink} size="small" color="inherit" onClick={() => setOpen(true)}>
                <HelpIcon/>
            </IconButton>
            {open &&
            <DialogViewPort open fullScreen={false} maxWidth="lg" innerMaxWidth="lg" >
                <DefaultViewTitle title={title} onClose={() => setOpen(false)}/>
                <PdfViewer filename={filename} />
            </DialogViewPort>
            }
        </>
    );
});