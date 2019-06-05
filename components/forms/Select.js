import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';

export default ({ label }) => {
	const [ values, setValues ] = React.useState([ {} ]);
	function handleChange(event) {
		setValues(event.target.value);
	}

	return (
		<div>
			<InputLabel htmlFor="outlined-age-simple">{label}</InputLabel>
			<Select value={10} onChange={handleChange} input={<OutlinedInput name="age" id="outlined-age-simple" />}>
				<MenuItem value="">
					<em>None</em>
				</MenuItem>
				<MenuItem value={10}>Coletivo Audio-visual</MenuItem>
				<MenuItem value={20}>Linhas de ação</MenuItem>
				<MenuItem value={30}>Associação Floresta Protegida</MenuItem>
			</Select>
		</div>
	);
};
