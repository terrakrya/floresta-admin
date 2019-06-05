import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';

export default ({ open, onClose }) => {
	return (
		<Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
			<DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
			<List>
				<ListItem button onClick={() => console.log('CLicked')}>
					<ListItemText primary={'Fuck'} />
				</ListItem>
				<ListItem button onClick={() => console.log('Now what?')}>
					<ListItemAvatar>
						<Avatar>
							<AddIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary="add account" />
				</ListItem>
			</List>
		</Dialog>
	);
};
