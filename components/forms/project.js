import React from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import isISODate from 'is-iso-date';

import ProjectInputs from './projectInputs';

const styles = (theme) => ({
	container: {
		display: 'flex',
		flexFlow: 'row wrap'
	},
	root: {
		display: 'flex',
		flexFlow: 'column',
		alignItems: 'center',
		...theme.mixins.gutters(),
		paddingTop: theme.spacing(1) * 2,
		paddingBottom: theme.spacing(1) * 2
	},
	full: {
		flexBasis: '100%'
	},
	column: {
		display: 'flex',
		flexFlow: 'row nowrap',
		alignItems: 'center',
		justifyContent: 'space-around',
		flexBasis: '33.33%',
		width: '100%'
	},
	inputs: {
		minWidth: 300,
		display: 'flex',
		flexFlow: 'column',
		alignItems: 'center'
	},
	selectors: {
		height: 400,
		display: 'flex',
		flexFlow: 'column',
		alignItems: 'center',
		justifyContent: 'space-around'
	},
	footer: {
		display: 'flex',
		flexFlow: 'row nowrap',
		alignItems: 'center',
		justifyContent: 'space-around',
		paddingTop: 50
	}
});

const ProjectForm = ({ classes, project, categories, tags, update, remove, client }) => {
	// Form
	const initialState = {
		media: '',
		icon: '',
		category: '',
		tags: null,
		name: '',
		description: '',
		photos: null
	};
	const [ formState, setFormState ] = React.useState(initialState);
	const handleInput = (key, input) => {
		setFormState({ ...formState, [key]: input });
	};

	// Upload Media
	const handleMediaUpload = (uploaded) => {
		setFormState({ ...formState, media: uploaded });
	};
	// Upload Photos
	const [ dialogOpen, setDialog ] = React.useState({
		tag: false
	});

	const handlePhotosUpload = (uploaded) => {
		setFormState({ ...formState, photos: uploaded });
	};
	// Dialogs
	function handleClickOpen(dialog) {
		setDialog({ ...dialogOpen, [dialog]: true });
	}

	const handleDialogClose = (dialog, value) => {
		setDialog({ ...dialogOpen, [dialog]: false });
	};
	// Category
	const handleSelectCategory = (value) => {
		if (categories) {
			setFormState({ ...formState, category: value });
		}
	};
	// Tags
	const handleSelectTag = (value) => {
		setFormState({ ...formState, tags: value });
	};
	// Editor
	const handleEditor = (editor) => {
		setFormState({ ...formState, description: editor });
	};
	// Submit
	const handleSubmit = async (state) => {
		let formatedInputs = state;
		if (project && project.id) {
			formatedInputs.id = project.id;
		}
		formatedInputs.category = categories.filter((i) => i.name === state.category)[0].id;
		let tagsId = [];
		state.tags.map((tag) => {
			tags.map((t) => {
				if (t.name === tag) {
					tagsId.push(t.id);
				}
			});
		});
		formatedInputs.tags = tagsId;
		console.log('formatedInputs', formatedInputs);
		const res = await update({ variables: { input: formatedInputs } });
		console.log('RES', res);
		if (res && res.data) {
			Router.push('/projects');
		}
	};
	return (
		<ProjectInputs
			initialState={initialState}
			formState={formState}
			data={project}
			remove={remove}
			client={client}
			handleSubmit={handleSubmit}
			classes={classes}
			categories={categories}
			tags={tags}
			handleInput={handleInput}
			handleSelectCategory={handleSelectCategory}
			handleSelectTag={handleSelectTag}
			dialogOpen={dialogOpen}
			handleDialogClose={handleDialogClose}
			handlePhotosUpload={handlePhotosUpload}
			handleMediaUpload={handleMediaUpload}
			handleClickOpen={handleClickOpen}
			handleEditor={handleEditor}
		/>
	);
};

ProjectForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProjectForm);
