import Router from "next/router"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import DialogTitle from "@material-ui/core/DialogTitle"
import Dialog from "@material-ui/core/Dialog"
import Avatar from "@material-ui/core/Avatar"
import AddIcon from "@material-ui/icons/Add"

export default ({ open, onClose, data, editUrl, createText, identifier }) => {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby={`criar-nova-${editUrl}`}
      open={open}
    >
      <DialogTitle id={`criar-nova-${editUrl}`}>
        Selecione para atualizar
      </DialogTitle>
      <List>
        {data &&
          data !== "loading" &&
          data.map(d => (
            <ListItem
              key={d.id}
              button
              onClick={() =>
                Router.push(
                  `${editUrl}?${identifier || slug}=${d[identifier] || d.slug}`
                )
              }
            >
              <ListItemText primary={d.name} />
            </ListItem>
          ))}

        {createText && (
          <ListItem button onClick={() => Router.push(editUrl)}>
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={createText} />
          </ListItem>
        )}
      </List>
    </Dialog>
  )
}
