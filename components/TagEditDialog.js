import Router from 'next/router';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';

export default ({ open, onClose, tags }) => {
	return (
		<Dialog onClose={onClose} aria-labelledby="criar-nova-etiqueta" open={open}>
			<DialogTitle id="criar-nova-etiqueta">Selecione etiqueta para atualizar</DialogTitle>
			<List>
				{tags &&
					tags.map((tag) => (
						<ListItem key={tag.id} button onClick={() => Router.push(`/tag_edit?slug=${tag.slug}`)}>
							<ListItemText primary={tag.name} />
						</ListItem>
					))}

				<ListItem button onClick={() => Router.push('/tag_edit')}>
					<ListItemAvatar>
						<Avatar>
							<AddIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary="Criar nova etiqueta" />
				</ListItem>
			</List>
		</Dialog>
	);
};
