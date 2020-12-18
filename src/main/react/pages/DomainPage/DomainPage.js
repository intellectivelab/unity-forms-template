import React, {useState} from 'react';

import * as R from "ramda";

import clsx from 'clsx';

import {Sidebar} from '@intellective/core';

import {AppBar, Box, Hidden, IconButton, Link, Toolbar, Tooltip, Typography, withStyles} from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu";

import styles from "./styles";

const StateLogoPrimary = () => {
	return (
		<Link href="http://ct.gov/">
			<img src="./ct_logo.svg" alt="State of Connecticut"/>
		</Link>
	);
};

const StateLogoSecondary = () => {
	return (
		<Link href="http://ct.gov/">
			<img src="./logo.svg" alt="State of Connecticut"/>
		</Link>
	);
};

const AppBarInterior = props => {
	const {classes, variant, title, pages = [], logo, userInfo, appBarVisible = true, ...otherProps} = props;

	const [menuVisible, toggleMenu] = useState(false);

	return (
		<>
			{appBarVisible &&
			<AppBar className={clsx(classes.appBar)} position='static'>
				<Toolbar className={classes.toolbar} variant={variant}>
					{logo}

					<div style={{flexGrow: 1}}/>

					{userInfo}

					{pages.length > 1 &&
					<IconButton color="inherit" edge="end" size="small" aria-label="Main menu" onClick={() => toggleMenu(!menuVisible)}>
						<Tooltip title="Main menu"><MenuIcon/></Tooltip>
					</IconButton>}
				</Toolbar>
			</AppBar>}

			<Sidebar title={title} visible={menuVisible && pages.length > 1} pages={pages} toggleMenu={toggleMenu} {...otherProps}/>
		</>
	);
};

const DomainPage = (props) => {
	const {classes, title, component, searchParams = {}, userInfo, ...otherProps} = props;

	const hideAppBar = R.has('hideAppBar', searchParams);

	const logo = (
		<Box display="flex" flexDirection="row" flexWrap="noWrap" alignItems="center">
			<Hidden mdDown>
				<StateLogoPrimary/>

				<Box mx={1}>
					<Typography variant="subtitle1" color="inherit" noWrap>{title}</Typography>
				</Box>
			</Hidden>

			<Hidden lgUp>
				<StateLogoSecondary/>
			</Hidden>
		</Box>
	);

	const drawerTitle = <AppBar position="relative"><Toolbar variant="dense"><StateLogoSecondary/></Toolbar></AppBar>;

	return (
		<div className={classes.root}>
			<AppBarInterior {...otherProps} classes={classes} title={drawerTitle} logo={logo} userInfo={userInfo} appBarVisible={!hideAppBar}/>

			<main className={classes.container}>
				{component}
			</main>
		</div>
	);
};

export default withStyles(styles)(DomainPage);