import React, {useRef} from "react";

import * as R from 'ramda';

import {Grid, withStyles} from "@material-ui/core";

import {useDimensions} from "@intellective/core";

const styles = () => ({
	root: {
		//
	},
	container: {
		//
	}
});

const DomainPageLayout = (props) => {

	const {classes} = props;

	const layoutXX = R.curry((x, element) => (
		<Grid key={element.props.id} className={classes[element.props.type]} item xs={12} sm={12} md={x} lg={x}>
			{element}
		</Grid>
	));

	const layoutMap = {};
	const otherChildren = [];

	React.Children.forEach(props.children, (child) => {
		if (child && child.type === 'section') {
			layoutMap[child.props["data-bind-to"]] = !child.props.hidden && child.props.children;
		} else {
			otherChildren.push(child);
		}
	});

	const containerLayout = R.cond([
		[R.startsWith('X'), (x) => layoutXX(parseInt(x.substring(1)))],
		[R.T, R.always(layoutXX(12))]
	]);

	const rootRef = useRef();
	const dimensions = useDimensions(rootRef);

	const styles = {
		maxHeight: `calc(100vh - ${dimensions.offsetTop}px)`,
		overflowY: 'auto',
	};

	return (
		<div className={classes.root}>
			<div className={classes.container} ref={rootRef} style={styles}>
				{Object.entries(layoutMap).map(([name, components]) => (
					components && components.length > 0 &&
					<Grid key={name} container>
						{components.map((cmp) => containerLayout(cmp.props.layout || cmp.props.type)(cmp))}
					</Grid>
				))}
				{otherChildren}
			</div>
		</div>
	);
};

export default withStyles(styles)(DomainPageLayout);