import React from "react";

import {Box, Link, Typography, withStyles} from "@material-ui/core";

const styles = theme => ({
	link: {
		paddingTop: theme.spacing(0.5)
	},
	img: {
		height: "30px"
	}
});

const IntellectiveLogo = ({classes}) => {
	return (
		<Link href="https://www.intellective.com" className={classes.link}>
			<img src="./unitysp-logo-vector-small.svg" alt="Intellective Company" className={classes.img}/>
		</Link>
	);
};

const DomainLogo = ({title, classes}) => (
	<Box display="flex" flexDirection="row" flexWrap="noWrap" alignItems="center" alignContent="flex-start">
        <IntellectiveLogo classes={classes}/>

        {title && <Box mx={1}>
            <Typography variant="subtitle1" color="inherit" noWrap>{title}</Typography>
        </Box>}
	</Box>
);

export default  withStyles(styles)(DomainLogo);


