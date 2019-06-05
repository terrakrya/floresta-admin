import { makeStyles, useTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
		maxWidth: 300
	},
	chips: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	chip: {
		margin: 2
	},
	noLabel: {
		marginTop: theme.spacing(3)
	}
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const names = [ 'Castanha', 'Rio Marangua', 'Encontro nacional' ];
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250
		}
	}
};

export default ({ label }) => {
	const classes = useStyles();
	const theme = useTheme();
	const [ personName, setPersonName ] = React.useState([]);
	function handleChange(event) {
		setPersonName(event.target.value);
	}
	function handleChangeMultiple(event) {
		const { options } = event.target;
		const value = [];
		for (let i = 0, l = options.length; i < l; i += 1) {
			if (options[i].selected) {
				value.push(options[i].value);
			}
		}
		setPersonName(value);
	}

	return (
		<div>
			<InputLabel htmlFor="select-multiple-chip">{label}</InputLabel>
			<Select
				multiple
				value={names}
				onChange={(e) => console.log(e)}
				input={<Input id="select-multiple-chip" />}
				renderValue={(selected) => (
					<div className={classes.chips}>
						{selected.map((value) => <Chip key={value} label={value} className={classes.chip} />)}
					</div>
				)}
				MenuProps={MenuProps}
			>
				{names.map((name) => (
					<MenuItem key={name} value={name}>
						{name}
					</MenuItem>
				))}
			</Select>
		</div>
	);
};
