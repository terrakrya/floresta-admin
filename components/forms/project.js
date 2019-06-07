import React from 'react';
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
import PROJECTS from '../../queries/projects.gql';

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

const Page = ({
	data,
	handleSubmit,
	remove,
	client,
	classes,
	categories,
	tags,
	handleSelectCategory,
	selectedCategory,
	handleSelectTag,
	selectedTags,
	dialogOpen,
	handleDialogClose,
	handleUpload,
	uploadedList,
	onEditorStateChange,
	handleClickOpen,
	blur,
	change
}) => {
	React.useEffect(
		() => {
			if (data && typeof data !== 'string') {
				if (!selectedCategory && data.category) {
					handleSelectCategory(data.category.slug, change, blur);
				}
				if (!selectedTags && data.tags) {
					handleSelectTag(data.tags.map((i) => i.name), change, blur);
				}
				if (uploadedList.length < 1 && data.photos.length > 0) {
					handleUpload(data.photos, change, blur);
				}
			} else {
				if (typeof categories !== 'string' && !selectedCategory) {
					handleSelectCategory(categories[0].slug, change, blur);
				}
			}
		},
		[ categories, data, handleSelectCategory, change, blur ]
	);
	return (
		<form onSubmit={handleSubmit}>
			<Paper className={classes.root} elevation={1}>
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
							<Field
								name="category"
								component={Select}
								label={'Selecione a categoria deste projeto'}
								items={categories}
								create={'Criar nova categoria'}
								createAction={() => Router.push(`/category_edit`)}
								setSelected={(value) => handleSelectCategory(value, change, blur)}
								selected={selectedCategory}
							/>
							{categories !== 'loading' &&
							categories.length > 0 && (
								<Button
									size="small"
									color="primary"
									onClick={() =>
										Router.push(`/category_edit?slug=${selectedCategory || categories[0].slug}`)}
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
						<Field name="tags">
							{(fieldprops) => (
								<MultiSelect
									// {...fieldprops}
									label={'Selectione as etiquetas deste projeto'}
									items={tags}
									create={'Criar nova etiqueta'}
									createAction={() => Router.push(`/tag_edit`)}
									setSelected={(e) => handleSelectTag(e.target.value, change, blur)}
									selected={selectedTags}
								/>
							)}
						</Field>
						<Button size="small" color="primary" onClick={() => handleClickOpen('tag')}>
							Atualizar etiquetas
						</Button>
						<TagEditDialog tags={tags} open={dialogOpen.tag} onClose={(v) => handleDialogClose('tag', v)} />
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
							<img key={image} src={image} style={{ maxWidth: `${100 / uploadedList.length}%` }} />
						))}
					{uploadedList.length === 0 && <h4>Este projeto não tem imagens</h4>}
				</div>
				<div className={classNames(classes.column, classes.helper)}>
					<Typography variant="caption">
						Fotos do projeto
						<br />
						<Field name="photos">
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
					<Button size="small" onClick={() => Router.push('/projects')}>
						Cancelar
					</Button>
					<Button size="small" color="default" type="submit">
						Publicar projeto
					</Button>
					{remove && (
						<Button
							size="small"
							onClick={async () => {
								alert('Tem certeza que deseja remover esse projeto?');
								const res = await remove({ variables: { id: data.id } });
								console.log('RES', res);
								const projects = client.readQuery({ query: PROJECTS });
								console.log('projects', projects);
								const newList = projects.project.filter((i) => i.id !== res.data.removeProjectCategory);
								console.log('newList', newList);
								client.writeData({ data: { project: newList } });
								Router.push('/projects');
							}}
						>
							Remover
						</Button>
					)}
				</div>
			</Paper>
			<style jsx>{`
				img {
					max-width: 300px;
					max-height: 300px;
				}
			`}</style>
		</form>
	);
};

const ProjectForm = ({ classes, project, categories, tags, update, remove, client }) => {
	// Upload
	const initialMedia = project && project.media ? project.media : null;
	const initialPhotos = project && project.photos ? project.photos : [];
	const [ uploadedList, setUpload ] = React.useState(initialPhotos);
	const [ dialogOpen, setDialog ] = React.useState({
		tag: false
	});
	const clearUpload = () => setUpload([]);
	const handleUpload = (uploaded, change, blur) => {
		blur('photos');
		change('photos', uploaded);
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

	const handleSelectCategory = (value, change, blur) => {
		const selectedId = categories.filter((i) => i.slug === value)[0].id;
		// console.log('selectedId', selectedId);
		blur('category');
		change('category', selectedId);
		setSelectedCategory(value);
	};
	// Tag
	const [ selectedTags, setSelectedTags ] = React.useState(null);
	const handleSelectTag = (value, change, blur) => {
		blur('tags');
		const selectedIds = [];
		if (tags) {
			tags.map((tag) => {
				return value.map((value) => {
					if (tag.name === value) return selectedIds.push(tag.id);
				});
			});
		}
		change('tags', selectedIds);
		setSelectedTags(value);
	};
	// Editor
	const onEditorStateChange = (editor, change, blur) => {
		blur('description');
		change('description', editor);
	};
	// console.log('PRJECT', project);
	const intialValues = {};
	if (project) {
		Object.keys(project).map((key) => {
			if (key === 'tags') {
				return (intialValues.tags = project[key].map((i) => i.id));
			}
			if (key === 'category') {
				return (intialValues.category = project[key].id);
			}
			if (key !== '__typename') {
				return (intialValues[key] = project[key]);
			}
		});
	}
	// console.log('intialValues', intialValues);
	return (
		<Form
			initialValues={intialValues}
			onSubmit={async (e) => {
				const cleanVars = {};
				Object.keys(e).map((i) => {
					if (i !== '__typename') Object.assign(cleanVars, { [i]: e[i] });
				});
				console.log('cleanVars', cleanVars);
				const res = await update({ variables: { input: cleanVars } });
				console.log('RES', res);
				if (res && res.data) {
					// const projects = client.readQuery({ query: PROJECTS });
					// const newList = projects.projects.concat(res.data.saveProject);
					// console.log('newList', newList);
					// client.writeData({ data: { projects: newList } });
					Router.push('/projects');
				}
			}}
			validate={validate}
			render={({ handleSubmit, pristine, invalid, form: { change, blur } }) => (
				<Page
					data={project}
					remove={remove}
					client={client}
					handleSubmit={handleSubmit}
					classes={classes}
					categories={categories}
					tags={tags}
					handleSelectCategory={handleSelectCategory}
					selectedCategory={selectedCategory}
					handleSelectTag={handleSelectTag}
					selectedTags={selectedTags}
					dialogOpen={dialogOpen}
					handleDialogClose={handleDialogClose}
					handleUpload={handleUpload}
					uploadedList={uploadedList}
					handleClickOpen={handleClickOpen}
					blur={blur}
					change={change}
					onEditorStateChange={onEditorStateChange}
				/>
			)}
		/>
	);
};

ProjectForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProjectForm);
