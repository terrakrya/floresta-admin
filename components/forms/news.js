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

const NewsForm = ({ classes, update, data, remove, client }) => {
	const { previousPagePath } = React.useContext(StateContext);
	const goBackUrl = previousPagePath || '/news_edit';
	const onEditorStateChange = (editor, change, blur) => {
		blur('description');
		change('description', editor);
	};
	console.log('DATA', data);
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
						Router.push(goBackUrl);
					}
				}}
				validate={validate}
				render={({ handleSubmit, pristine, invalid, form: { change, blur } }) => (
					<form onSubmit={handleSubmit}>
						<Typography component="h5" variant="h5">
							Link da notícia
						</Typography>
						<Field name={'link'} component={OutlineTextField} inputType={'text'} />
						<Typography component="h5" variant="h5">
							Descrição da notícia
						</Typography>
						<Field
							name={'description'}
							component={OutlineTextField}
							inputType={'html'}
							handleEditor={(e) => onEditorStateChange(e, change, blur)}
						/>
						<Divider />
						<Button
							size="small"
							color="default"
							type="submit"
							// disabled={}
						>
							Salvar notícia
						</Button>
						<Button size="small" onClick={() => Router.push(goBackUrl)}>
							Cancelar
						</Button>
						{data && (
							<Button
								size="small"
								onClick={async () => {
									alert('Tem certeza que deseja remover essa notícia?');
									const res = await remove({ variables: { id: data.id } });
									console.log('RES', res);
									// const villages = client.readQuery({ query: VILLAGES });
									// console.log('villages', villages);
									// const newList = villages.projectCategories.filter(
									// 	(i) => i.id !== res.data.removeProjectCategory
									// );
									// console.log('newList', newList);
									// client.writeData({ data: { projectCategories: newList } });
									Router.push(goBackUrl);
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

NewsForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NewsForm);
