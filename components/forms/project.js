import React from 'react'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
// import isISODate from 'is-iso-date';

import ProjectInputs from './projectInputs'

const styles = theme => ({
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
  inputs: {
    minWidth: 300,
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center'
  },
  selectors: {
    height: 400,
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  footer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 50
  }
})

const ProjectForm = ({
  classes,
  project,
  tags,
  categories,
  update,
  remove,
  client
}) => {
  // Form
  const initialState = {
    media: '',
    categories: null,
    tags: null,
    name: '',
    description: '',
    intro: '',
    photos: null
  }
  const [formState, setFormState] = React.useState(initialState)
  const handleInput = (key, input) => {
    setFormState({ ...formState, [key]: input })
  }

  // Upload Media
  const handleMediaUpload = uploaded => {
    setFormState({ ...formState, media: uploaded })
  }
  // Upload Photos
  const [dialogOpen, setDialog] = React.useState({
    tag: false,
    categories: false
  })

  const handlePhotosUpload = uploaded => {
    setFormState({ ...formState, photos: uploaded })
  }
  // Dialogs
  function handleClickOpen (dialog) {
    setDialog({ ...dialogOpen, [dialog]: true })
  }

  const handleDialogClose = (dialog, value) => {
    setDialog({ ...dialogOpen, [dialog]: false })
  }
  // Categories
  const handleSelectCategories = value => {
    // if (project && project.categories) {
    //   setFormState({ ...formState, categories: value })
    // }
    setFormState({ ...formState, categories: value })
  }
  // Tags
  const handleSelectTag = value => {
    setFormState({ ...formState, tags: value })
  }
  // Editor
  const handleEditor = editor => {
    setFormState({ ...formState, description: editor })
  }
  // Submit
  const handleSubmit = async state => {
    let formatedInputs = state
    if (project && project.id) {
      formatedInputs.id = project.id
    }
    formatedInputs.categories = state.categories.map(i => {
      const res = categories.filter(c => c.name === i)
      return res[0].category
    })
    let tagsId = []
    if (state.tags) {
      state.tags.map(tag => {
        tags.map(t => {
          if (t.name === tag) {
            tagsId.push(t.id)
          }
        })
      })
    }

    formatedInputs.tags = tagsId
    console.log('formatedInputs', formatedInputs)
    const res = await update({ variables: { input: formatedInputs } })
    console.log('RES', res)
    if (res && res.data) {
      Router.push('/projects?refresh')
    }
  }
  return (
    <ProjectInputs
      initialState={initialState}
      formState={formState}
      data={project}
      remove={remove}
      client={client}
      handleSubmit={handleSubmit}
      classes={classes}
      tags={tags}
      categories={categories}
      handleInput={handleInput}
      handleSelectCategories={handleSelectCategories}
      handleSelectTag={handleSelectTag}
      dialogOpen={dialogOpen}
      handleDialogClose={handleDialogClose}
      handlePhotosUpload={handlePhotosUpload}
      handleMediaUpload={handleMediaUpload}
      handleClickOpen={handleClickOpen}
      handleEditor={handleEditor}
    />
  )
}

ProjectForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ProjectForm)
