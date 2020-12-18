import React, {useState} from "react";

import {Avatar, Box, IconButton, lighten, List, ListItem, ListItemText, Paper, Popover, Tooltip, Typography, withStyles} from "@material-ui/core";

import Link from "@material-ui/core/Link";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import PersonIcon from "@material-ui/icons/Person";

import withExternalUserInfo from "./withExternalUserInfo";

import {DEEP_API_URL} from "../../utils/integration";

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

const DEEP_API_LINKS_URL_TEMPLATE = DEEP_API_URL + "/links/";

const buildUrl = (endpoint) => (DEEP_API_LINKS_URL_TEMPLATE + endpoint + '?back=' + window.location.hash.replace('#', ''));

const UserMenuItem = ({url, label}) => {
	return (
		<ListItem button component={Link} href={url}>
			<ListItemText primary={label}/>
		</ListItem>
	);
};

const ManageOutstandingPaymentsLink = () => (<UserMenuItem url={buildUrl('manage-payments-admin')} label="Manage Outstanding Payments"/>);
const ManageSubscriberAgreementsLink = () => (<UserMenuItem url={buildUrl('manage-sa')} label="Manage Subscriber Agreements"/>);
const ManageAdminRequestsLink = () => (<UserMenuItem url={buildUrl('manage-admin-role-request')} label="Manage Admin Requests"/>);
const ManageCertificationRequestsLink = () => (<UserMenuItem url={buildUrl('manage-certification-request')} label="Manage Certification Requests"/>);
const ManageCompanyLink = () => (<UserMenuItem url={buildUrl('manage-company-entity')} label="Manage Company / Entity"/>);

const AdminFunctionsSubMenu = (props) => {
	const {classes, anchorEl, open, onMenuClose} = props;

	return (
		<Popover
			open={open}
			anchorEl={anchorEl}
			role="tooltip"
			onClose={onMenuClose}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'left'
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right'
			}}
		>
			<Paper className={classes.container}>
				<Box className={classes.links}>
					<List role="list" onMouseLeave={onMenuClose}>
						<ManageOutstandingPaymentsLink/>
						<ManageSubscriberAgreementsLink/>
						<ManageAdminRequestsLink/>
						<ManageCertificationRequestsLink/>
						<ManageCompanyLink/>
					</List>
				</Box>
			</Paper>
		</Popover>
	);
};

const UserProfileLink = () => (<UserMenuItem url={buildUrl('user-profile')} label="User Profile"/>);

const SubscriberAgreementLink = () => (<UserMenuItem url={buildUrl('manage-my-sa')} label="Subscriber Agreement"/>);

const AdminFunctionsLink = ({onMouseEnter}) => {
	return (
		<ListItem button onMouseEnter={onMouseEnter}>
			<ListItemText primary="Admin Functions"/>
			<ArrowRightIcon/>
		</ListItem>
	);
};

const PaymentsLink = () => (<UserMenuItem url={buildUrl('manage-payments-non-admin')} label="Your E-Filing Payments"/>);

const ExternalProfile = withStyles(styles)((props) => {
	const {classes, user = {}} = props;

	const [anchorEl, setAnchorEl] = useState(null);
	const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);

	const userName = `${user.firstName} ${user.lastName}`;

	const showSubmenuHandler = (event) => {
		setSubMenuAnchorEl(event.currentTarget);
	};

	const closeSubmenuHandler = () => {
		setSubMenuAnchorEl(null);
	};

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
								{userName}
							</Typography>
							<Typography variant="caption" align="center">
								{user.email}
							</Typography>
						</Box>
					</Box>
					<Box className={classes.links}>
						<List role="list">
							<UserProfileLink/>
							<SubscriberAgreementLink/>
							<AdminFunctionsLink onMouseEnter={showSubmenuHandler}/>
							<PaymentsLink/>
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
			<AdminFunctionsSubMenu classes={classes} open={Boolean(subMenuAnchorEl)} anchorEl={subMenuAnchorEl} onMenuClose={closeSubmenuHandler} role="menu"/>
		</>
	);
});

export default withExternalUserInfo(ExternalProfile);
