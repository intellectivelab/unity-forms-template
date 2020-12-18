import React, {useState} from "react";

import {Avatar, Box, IconButton, lighten, List, ListItem, ListItemText, Paper, Popover, Tooltip, Typography, withStyles} from "@material-ui/core";

import PersonIcon from "@material-ui/icons/Person";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const styles = theme => ({
	container: {
		//
	},
	userInfo: {
		padding: theme.spacing(4, 4, 2, 4),
	},
	links: {
		//
	},
	headerLink: {
		color: lighten(theme.palette.primary.main, .5),
		marginLeft: 'auto'
	},
});

const InternalProfile = withStyles(styles)((props) => {
	//default name and email added to test display
	const {
		classes,
		user = {name: "Oleg Bondarchuk", email: "obondarchuk@intellective.com"},
	} = props;

	const [anchorEl, setAnchorEl] = useState(null);

	return (
		<>
			<IconButton
				className={classes.headerLink}
				aria-label="Profile"
				edge="end"
				role="button"
				tabIndex="0"
				onClick={(event) => setAnchorEl(event.target)}
			>
				<Tooltip title="Profile">
					<AccountCircleIcon/>
				</Tooltip>
			</IconButton>

			<Popover
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				role="tooltip"
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
			>
				<Paper className={classes.container}>
					<Box className={classes.userInfo} display="flex" flexDirection="column" alignItems="center">
						<Box>
							<Avatar>
								<PersonIcon/>
							</Avatar>
						</Box>
						<Box mt={1}>
							<Typography variant="h6" align="center">
								{user.name}
							</Typography>
							<Typography variant="caption" align="center">
								{user.email}
							</Typography>
						</Box>
					</Box>
					<Box className={classes.links}>
						<List role="list">
							<ListItem button onClick={(event) =>{
								window.localStorage.clear();
								window.location.href = window.location.origin + '/logout';
							}}>
								<ListItemText primary="Logout"/>
							</ListItem>
						</List>
					</Box>
				</Paper>
			</Popover>
		</>
	);
});

export default InternalProfile;
