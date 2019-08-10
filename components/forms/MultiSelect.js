import { makeStyles, useTheme } from "@material-ui/core/styles"
import Chip from "@material-ui/core/Chip"
import Input from "@material-ui/core/Input"
import Select from "@material-ui/core/Select"
import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: 2
  },
  noLabel: {
    marginTop: theme.spacing(3)
  }
}))
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

export default ({
  label,
  items,
  selected,
  setSelected,
  create,
  createAction
}) => {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <div>
      <InputLabel htmlFor={`select-multiple-${label}`}>{label}</InputLabel>
      {typeof items !== "string" && (
        <Select
          multiple
          value={selected || []}
          onChange={e => setSelected(e)}
          input={<Input id={`select-multiple-${label}`} />}
          MenuProps={MenuProps}
          renderValue={selected => {
            if (selected && selected.length > 0) {
              return (
                <div className={classes.chips}>
                  {selected.map(value => (
                    <Chip key={value} label={value} className={classes.chip} />
                  ))}
                </div>
              )
            }
          }}
        >
          {items &&
            items.length > 0 &&
            items.map(i => (
              <MenuItem key={i.id} value={i.name}>
                {i.name}
              </MenuItem>
            ))}
        </Select>
      )}
    </div>
  )
}
