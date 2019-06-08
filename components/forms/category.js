import React, { Component } from 'react';
import Router from 'next/router';
import { Form, Field } from 'react-final-form';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Upload from './Upload';
import OutlineTextField from './OutlineTextField';
import CATEGORIES from '../../queries/categories.gql';
import StateContext from '../../lib/StateContext';

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
	}
});

const CategoryForm = ({ classes, onSubmit, project, update, data, remove, client }) => {
	const { previousPagePath } = React.useContext(StateContext);
	const initialMedia = data && data.media ? data.media : null;
	const [ uploadedImage, setUpload ] = React.useState(initialMedia);
	const clearUpload = () => setUpload([]);
	console.log('previousPagePath', previousPagePath);
	const handleUpload = (uploaded, change, blur) => {
		blur('media');
		change('media', uploaded[0]);
		setUpload(uploaded[0]);
	};

	const onEditorStateChange = (editor, change, blur) => {
		blur('description');
		change('description', editor);
	};
	return (
		<Paper className={classes.root} elevation={1}>
			<Form
				initialValues={data ? data : {}}
				onSubmit={async (e) => {
					const cleanVars = {};
					Object.keys(e).map((i) => {
						if (i !== '__typename') Object.assign(cleanVars, { [i]: e[i] });
					});
					console.log('cleanVars', cleanVars);
					const res = await update({ variables: { input: cleanVars } });
					console.log('RES', res);
					if (res && res.data) {
						const categories = client.readQuery({ query: CATEGORIES });
						const newList = categories.projectCategories.concat(res.data.saveProjectCategory);
						console.log('newList', newList);
						client.writeData({ data: { projectCategories: newList } });
						Router.push('/project_edit');
					}
					// let cleanList = {};
					// await onSubmit(cleanList);
					// clearUpload();
				}}
				validate={validate}
				render={({ handleSubmit, pristine, invalid, form: { change, blur } }) => (
					<form onSubmit={handleSubmit}>
						<Typography component="h5" variant="h5">
							Nome da categoria
						</Typography>
						<Field name={'name'} component={OutlineTextField} inputType={'text'} />
						<Typography component="h5" variant="h5">
							Descrição da categoria
						</Typography>
						<Field
							name={'description'}
							component={OutlineTextField}
							inputType={'html'}
							handleEditor={(e) => onEditorStateChange(e, change, blur)}
						/>
						<div className={classes.column}>
							<Typography component="h4" variant="h4">
								Imagem de capa
							</Typography>
						</div>
						<div className={classes.column}>
							{uploadedImage && <img src={uploadedImage} />}
							{/* {!uploaded && project && project.image && <img src={project.image} />} */}
							{!uploadedImage && <h4>Esta categoria não tem imagem de capa</h4>}
						</div>
						<div className={classNames(classes.column, classes.helper)}>
							<Typography variant="caption">
								Selecionar imagem de capa
								<br />
								<Field name="image">
									{(fieldprops) => (
										<Upload
											{...fieldprops}
											accept="image/*"
											handleUpload={(url) => handleUpload(url, change, blur)}
										/>
									)}
								</Field>
							</Typography>
						</div>
						<Divider />
						<Button
							size="small"
							color="default"
							type="submit"
							// disabled={}
						>
							Salvar categoria
						</Button>
						<Button size="small" onClick={() => Router.push(previousPagePath)}>
							Cancelar
						</Button>
						{data && (
							<Button
								size="small"
								onClick={async () => {
									alert('Tem certeza que deseja remover essa categoria?');
									const res = await remove({ variables: { id: data.id } });
									console.log('RES', res);
									const categories = client.readQuery({ query: CATEGORIES });
									console.log('categories', categories);
									const newList = categories.projectCategories.filter(
										(i) => i.id !== res.data.removeProjectCategory
									);
									console.log('newList', newList);
									client.writeData({ data: { projectCategories: newList } });
									Router.push('/project_edit');
								}}
							>
								Remover
							</Button>
						)}
					</form>
				)}
			/>
			<style jsx>{`
				img {
					max-width: 300px;
					max-height: 300px;
				}
			`}</style>
		</Paper>
	);
};

CategoryForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CategoryForm);
