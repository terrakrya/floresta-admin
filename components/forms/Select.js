import React from 'react';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import useConditionalEffect from 'use-conditional-effect';

export default ({ label, create, createAction, selected, setSelected, items }) => {
	function handleChange(event) {
		if (event.target.value === 'create') {
			createAction();
		} else {
			setSelected(event.target.value);
		}
	}
	return (
		<div>
			<InputLabel htmlFor="outlined-age-simple">{label}</InputLabel>
			{typeof items !== 'string' && (
				<Select
					value={selected || (items[0] ? items[0].slug : '')}
					onChange={handleChange}
					input={<OutlinedInput name={`select`} id={`select`} />}
				>
					{items.map((item, index) => (
						<MenuItem key={item.slug} value={item.slug} selected={index === 0}>
							{item.name}
						</MenuItem>
					))}
					{create && (
						<MenuItem value={'create'}>
							<Avatar>
								<AddIcon />
							</Avatar>
							{create}
						</MenuItem>
					)}
				</Select>
			)}
		</div>
	);
};
