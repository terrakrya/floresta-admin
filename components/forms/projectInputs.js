import React from 'react';
import Router from 'next/router';
import classNames from 'classnames';

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

export default ({
	initialState,
	data,
	handleSubmit,
	remove,
	client,
	classes,
	categories,
	tags,
	handleSelectCategory,
	handleInput,
	handleSelectTag,
	dialogOpen,
	handleDialogClose,
	handlePhotosUpload,
	handleMediaUpload,
	handleEditor,
	handleClickOpen,
	formState
}) => {
	React.useEffect(
		() => {
			if (data && typeof data !== 'string') {
				if (formState.name === initialState.name && data.name) {
					handleInput('name', data.name);
				}
				if (formState.media === initialState.media && data.media) {
					handleMediaUpload(data.media);
				}
				if (formState.category === initialState.category && data.category) {
					handleSelectCategory(data.category.name);
				}
				if (!formState.tags && data.tags) {
					handleSelectTag(data.tags.map((i) => i.name));
				}
				if (!formState.photos && data.photos.length > 0) {
					handlePhotosUpload(data.photos);
				}
				if (formState.description === initialState.description && data.description) {
					handleEditor(data.description);
				}
			} else {
				if (typeof categories !== 'string' && !formState.category) {
					handleSelectCategory(categories[0].name);
				}
			}
		},
		[ data, formState ]
	);
	const nameInput = {
		name: 'name',
		onChange: (e) => handleInput('name', e.target.value),
		value: formState.name
	};
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit(formState);
			}}
		>
			<Paper className={classes.root} elevation={1}>
				<Typography component="h1" variant="h3" style={{ padding: '35px 0' }}>
					Novo projeto
				</Typography>
				<Divider />
				<div className={classes.column}>
					<Typography component="h4" variant="h4">
						Capa
					</Typography>
				</div>
				<div className={classes.column}>
					{formState.media !== initialState.media && (
						<img src={formState.media} style={{ maxWidth: `${100 / formState.photos.length}%` }} />
					)}
					{formState.media === initialState.media && <h4>Este projeto não tem imagens</h4>}
				</div>
				<div className={classNames(classes.column, classes.helper)}>
					<Typography variant="caption">
						capa do projeto
						<br />
						<Upload accept="image/*" handleUpload={(url) => handleMediaUpload(url[0])} />
					</Typography>
				</div>
				<Divider />
				<div className={classes.inputs}>
					<Typography component="h5" variant="h5">
						Nome do projeto
					</Typography>
					<OutlineTextField inputType={'text'} input={nameInput} />
				</div>
				<div className={classes.selectors}>
					<Typography component="h5" variant="h5">
						Categoria
					</Typography>
					{categories && (
						<div className={classes.column}>
							<Select
								name="category"
								component={Select}
								label={'Selecione a categoria deste projeto'}
								items={categories}
								create={'Criar nova categoria'}
								createAction={() => Router.push(`/category_edit`)}
								setSelected={(value) => handleSelectCategory(value)}
								selected={formState.category}
							/>
							{categories !== 'loading' &&
							categories.length > 0 && (
								<Button
									size="small"
									color="primary"
									onClick={() =>
										Router.push(`/category_edit?slug=${formState.category || categories[0].slug}`)}
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
							setSelected={(e) => handleSelectTag(e.target.value)}
							selected={formState.tags || []}
						/>
						{/* )}
						</Field> */}
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
					{formState.photos &&
						formState.photos.map((image) => (
							<div key={image} className={'photo-list'}>
								<img src={image} style={{ maxWidth: `${100 / formState.photos.length}%` }} />
								<Button
									className="photo-list-button"
									size="small"
									onClick={async () => {
										handlePhotosUpload(formState.photos.filter((i) => i !== image));
									}}
								>
									Remover
								</Button>
							</div>
						))}
					{formState.photos && formState.photos.length === 0 && <h4>Este projeto não tem imagens</h4>}
				</div>
				<div className={classNames(classes.column, classes.helper)}>
					<Typography variant="caption">
						Fotos do projeto
						<br />
						<Upload
							multiple={true}
							accept="image/*"
							handleUpload={(urls) => handlePhotosUpload(formState.photos.concat(urls))}
						/>
					</Typography>
				</div>
				<Divider />
				<div className="description">
					<Typography component="h5" variant="h5">
						Descrição do projeto
					</Typography>
					<OutlineTextField
						name={'description'}
						inputType={'html'}
						input={{
							value: formState.description
						}}
						handleEditor={(e) => handleEditor(e)}
					/>
				</div>
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
								const projectsQuery = client.readQuery({ query: PROJECTS });
								console.log('projects', projectsQuery);
								const newList = projectsQuery.projects.filter(
									(i) => i.id !== res.data.removeProjectCategory
								);
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
				.photo-list {
					padding: 45px 0;
					display: flex;
					flex-flow: column;
					align-items: center;
				}
				.photo-list-button {
					position: relative;
					top: -30px;
				}
				img {
					max-width: 300px;
					max-height: 300px;
				}
				.description {
					padding: 45px 0;
				}
			`}</style>
		</form>
	);
};
