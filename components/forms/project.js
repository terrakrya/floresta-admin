import React, { Component } from 'react';
import Router from 'next/router';
import { Form, Field } from 'react-final-form';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
// import isISODate from 'is-iso-date';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Upload from './Upload';
import OutlineTextField from './OutlineTextField';
import Select from './Select';
import MultiSelect from './MultiSelect';
import TagEditDialog from '../TagEditDialog';

const validate = (values) => {
	const errors = {};
	// if (!values.slug) {
	//   errors.slug = 'Required'
	// }
	// if (!values.startCall) {
	//   errors.startCall = 'Required'
	// }
	// if (!values.endCall) {
	//   errors.endCall = 'Required'
	// }
	return errors;
};

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

const ProjectForm = ({ classes, onSubmit, project, publish, categories, tags }) => {
	// Upload
	const [ uploadedList, setUpload ] = React.useState([]);
	const [ dialogOpen, setDialog ] = React.useState({
		tag: false
	});
	const clearUpload = () => setUpload([]);
	const handleUpload = (uploaded, change, blur) => {
		console.log('uploaded', uploaded);
		blur('image');
		change('image', uploaded);
		setUpload(uploadedList.concat(uploaded));
	};
	// Dialogs
	function handleClickOpen(dialog) {
		setDialog({ ...dialogOpen, [dialog]: true });
	}

	const handleDialogClose = (dialog, value) => {
		setDialog({ ...dialogOpen, [dialog]: false });
	};
	// Category
	const [ selectedCategory, setSelectedCategory ] = React.useState(null);
	const handleSelectCategory = (e) => {
		setSelectedCategory(e);
	};
	// Tag
	const [ selectedTags, setSelectedTags ] = React.useState([]);
	const handleSelectTag = (event) => {
		// const { options } = event.target;
		// const value = [];
		// for (let i = 0, l = options.length; i < l; i += 1) {
		// 	if (options[i].selected) {
		// 		value.push(options[i].value);
		// 	}
		// }
		// console.log('Setting', value);
		setSelectedTags(event.target.value);
	};
	// Editor
	const onEditorStateChange = (editor, change, blur) => {
		blur('body');
		change('body', editor);
	};
	return (
		<Form
			initialValues={project ? formatedIssue : {}}
			onSubmit={async (e) => {
				let cleanList = {};
				await onSubmit(cleanList);
				clearUpload();
			}}
			validate={validate}
			render={({ handleSubmit, pristine, invalid, form: { change, blur } }) => (
				<form onSubmit={handleSubmit}>
					<Paper className={classes.root} elevation={1}>
						<span>{project && project.key}</span>
						<Typography component="h1" variant="h3" style={{ padding: '35px 0' }}>
							Novo projeto
						</Typography>
						<Divider />
						<div className={classes.inputs}>
							<Typography component="h5" variant="h5">
								Nome do projeto
							</Typography>
							<Field name={'name'} component={OutlineTextField} inputType={'text'} />
						</div>
						<div className={classes.selectors}>
							<Typography component="h5" variant="h5">
								Categoria
							</Typography>
							{categories && (
								<div className={classes.column}>
									<Select
										label={'Selecione a categoria deste projeto'}
										items={categories}
										create={'Criar nova categoria'}
										createAction={() => Router.push(`/category_edit`)}
										setSelected={handleSelectCategory}
										selected={selectedCategory}
									/>
									{categories !== 'loading' &&
									categories.length > 0 && (
										<Button
											size="small"
											color="primary"
											onClick={() =>
												Router.push(
													`/category_edit?slug=${selectedCategory || categories[0].slug}`
												)}
										>
											Atualizar categoria
										</Button>
									)}
								</div>
							)}
							<Typography component="h5" variant="h5">
								Etiquetas
							</Typography>
							<div className={classes.column}>
								<MultiSelect
									label={'Selectione as etiquetas deste projeto'}
									items={tags}
									create={'Criar nova etiqueta'}
									createAction={() => Router.push(`/tag_edit`)}
									setSelected={handleSelectTag}
									selected={selectedTags}
								/>
								<Button size="small" color="primary" onClick={() => handleClickOpen('tag')}>
									Atualizar etiquetas
								</Button>
								<TagEditDialog
									tags={tags}
									open={dialogOpen.tag}
									onClose={(v) => handleDialogClose('tag', v)}
								/>
							</div>
						</div>
						<div className={classes.column}>
							<Typography component="h4" variant="h4">
								Fotos
							</Typography>
						</div>
						<div className={classes.column}>
							{uploadedList.length > 0 &&
								uploadedList.map((image) => (
									<img
										key={image}
										src={image}
										style={{ maxWidth: `${100 / uploadedList.length}%` }}
									/>
								))}
							{/* {!uploaded && project && project.image && <img src={project.image} />} */}
							{uploadedList.length === 0 && !project && <h4>Este projeto não tem imagens</h4>}
						</div>
						<div className={classNames(classes.column, classes.helper)}>
							<Typography variant="caption">
								Fotos do projeto
								<br />
								<Field name="image">
									{(fieldprops) => (
										<Upload
											multiple={true}
											{...fieldprops}
											accept="image/*"
											handleUpload={(url) => handleUpload(url, change, blur)}
										/>
									)}
								</Field>
							</Typography>
						</div>
						<Divider />
						<Typography component="h5" variant="h5">
							Descrição do projeto
						</Typography>
						<Field
							name={'description'}
							component={OutlineTextField}
							inputType={'html'}
							onEditorStateChange={(e) => onEditorStateChange(e, change, blur)}
						/>
						<Divider />
						<div className={classes.footer}>
							<Button size="small">Cancelar</Button>
							<Button size="small" color="primary" type="submit" disabled={pristine || invalid}>
								Salvar
							</Button>
							<Button
								size="small"
								color="default"
								onClick={() => publish({ variables: { projectId: project.id } })}
								disabled={!project || !project.publishedCall || project.published}
							>
								Publicar projeto
							</Button>
						</div>
					</Paper>
					<style jsx>{`
						img {
							max-width: 300px;
							max-height: 300px;
						}
					`}</style>
				</form>
			)}
		/>
	);
};

ProjectForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProjectForm);
