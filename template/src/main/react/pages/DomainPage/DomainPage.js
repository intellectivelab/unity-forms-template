import React from 'react';

import {AppBar, Toolbar, withStyles} from "@material-ui/core";

import DomainLogo from "./DomainLogo";

import styles from "./styles";

const DomainPage = (props) => {
	const {classes, component,} = props;

	return (
		<div className={classes.root}>
			<AppBar position="relative" classes={{colorPrimary: classes.appBarColorPrimary}}>
				<Toolbar variant="dense">
					<DomainLogo/>

					<div style={{flexGrow: 1}}/>
				</Toolbar>
			</AppBar>

			<main className={classes.container}>
				{component}
			</main>
		</div>
	);
};

export default withStyles(styles)(DomainPage);
