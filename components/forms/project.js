import React, { Component } from 'react';
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
import MultiSelect from '../MultiSelect';

const validInputList = {
	name: {
		label: 'Nome do projeto',
		type: 'text'
	},
	key: {
		label: 'Slug',
		type: 'text',
		required: true
	},
	description: {
		label: 'Descrição do projeto',
		type: 'html'
	}
	// media: String
	// photos: [String]
	// categoryId: String
	// tags: [String]
	// startCall: {
	// 	label: 'Início da chamada',
	// 	type: 'date',
	// 	required: true
	// },
};

function isValidDate(dateString) {
	var regex_date = /^\d{4}\-\d{1,2}\-\d{1,2}$/;
	if (!regex_date.test(dateString)) {
		return false;
	}
	var parts = dateString.split('-');
	var day = parseInt(parts[2], 10);
	var month = parseInt(parts[1], 10);
	var year = parseInt(parts[0], 10);
	if (year < 1000 || year > 3000 || month == 0 || month > 12) {
		return false;
	}
	var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
	if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
		monthLength[1] = 29;
	}
	return day > 0 && day <= monthLength[month - 1];
}

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
	selectors: {
		height: 400,
		display: 'flex',
		flexFlow: 'column',
		alignItems: 'center',
		justifyContent: 'space-around'
	}
});

class IssueForm extends Component {
	state = {
		uploaded: null
	};

	clearUpload = () => this.setState({ uploaded: null });

	handleUpload = (uploaded, change, blur) => {
		blur('image');
		change('image', uploaded);
		this.setState({ uploaded });
	};

	onEditorStateChange = (editor, change, blur) => {
		blur('body');
		change('body', editor);
	};

	render() {
		const { uploaded } = this.state;
		const { classes, onSubmit, project, publish } = this.props;

		return (
			<Form
				initialValues={project ? formatedIssue : {}}
				onSubmit={async (e) => {
					let cleanList = {};
					Object.keys(validInputList).map((valid) => {
						Object.keys(e).map((i) => {
							if (i === valid && e[i] !== null) {
								if (isValidDate(e[i])) {
									/* parse date */
									cleanList[i] = new Date(e[i]).toISOString();
								} else if (0 === e[i] % (!isNaN(parseFloat(e[i])) && 0 <= ~~e[i])) {
									/* parse ints */
									cleanList[i] = parseInt(e[i]);
								} else {
									cleanList[i] = e[i];
								}
							}
						});
					});
					await onSubmit(cleanList);
					this.clearUpload();
				}}
				validate={validate}
				render={({ handleSubmit, pristine, invalid, form: { change, blur } }) => (
					<form onSubmit={handleSubmit}>
						<Paper className={classes.root} elevation={1}>
							<span>{project && project.key}</span>
							{/* <div className={classes.column}>
								<Typography component="h4" variant="h4">
									Capa
								</Typography>
							</div>
							<div className={classes.column}>
								{uploaded && <img src={uploaded} />}
								{!uploaded && project && project.image && <img src={project.image} />}
								{!uploaded && !project && <h4>Sem imagem de capa</h4>}
							</div>
							<div className={classNames(classes.column, classes.helper)}>
								<Typography variant="caption">
									Imagem de capa do projeto
									<br />
									<Field name="image">
										{(fieldprops) => (
											<Upload
												{...fieldprops}
												accept="image/*"
												handleUpload={(url) => this.handleUpload(url, change, blur)}
											/>
										)}
									</Field>
								</Typography>
							</div> */}
							<Typography component="h1" variant="h3" style={{ padding: '35px 0' }}>
								Novo projeto
							</Typography>
							<Divider />
							{Object.keys(validInputList)
								.filter((k) => {
									if (validInputList[k].type !== 'file') {
										return validInputList[k];
									}
								})
								.map((input) => (
									<div className={classes.full} key={input}>
										{validInputList[input].type === 'html' && (
											<h3>{validInputList[input].label}</h3>
										)}
										<Field
											name={input}
											component={OutlineTextField}
											inputType={validInputList[input].type}
											label={validInputList[input].label}
											required={validInputList[input].required || false}
											onEditorStateChange={
												validInputList[input].type === 'html' ? (
													(e) => this.onEditorStateChange(e, change, blur)
												) : null
											}
										/>
									</div>
								))}
							<div className={classes.selectors}>
								<Typography component="h5" variant="h5">
									Categoria
								</Typography>
								<div className={classes.column}>
									<Select label={'Selecione a categoria deste projeto'} />
									<Button size="small" color="primary">
										Nova categoria
									</Button>
								</div>
								<Typography component="h5" variant="h5">
									Etiquetas
								</Typography>
								<div className={classes.column}>
									<MultiSelect label={'Selectione as etiquetas deste projeto'} />
									<Button size="small" color="primary">
										Nova etiqueta
									</Button>
								</div>
							</div>
							<Divider />
							<Button size="small">Cancel</Button>
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
	}
}

IssueForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(IssueForm);
