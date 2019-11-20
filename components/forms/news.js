import React, { useEffect, useState } from 'react'
import { Form, Field } from 'react-final-form'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Radio from '@material-ui/core/Radio'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Upload from './Upload'
import OutlineTextField from './OutlineTextField'
import Actions from './Actions'
import MultiSelect from './MultiSelect'

const validate = values => {
  const errors = {}
  // if (!values.slug) {
  //   errors.slug = 'Required'
  // }
  // if (!values.startCall) {
  //   errors.startCall = 'Required'
  // }
  // if (!values.endCall) {
  //   errors.endCall = 'Required'
  // }
  return errors
}

const styles = theme => ({
  root: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(1) * 2,
    paddingBottom: theme.spacing(1) * 2
  },
  full: {
    flexBasis: '100%',
    padding: '20px 0',
    margin: '0 auto'
  },
  column: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexBasis: '33.33%',
    width: '100%',
    padding: '20px 0'
  }
})

const NewsForm = ({
  classes,
  update,
  data,
  remove,
  client,
  create,
  tagList
}) => {
  const goBackUrl = '/news'
  const [selectedMode, setSelectedMode] = useState('link')

  const [uploadedImage, setUpload] = useState((data && data.media) || null)
  const [tags, setSelectTag] = useState(
    (data && data.tags.map(t => t.name)) || []
  )
  const handleSelectTag = (newTags, change, blur) => {
    let tagIds = []
    tagList.map(t =>
      newTags.map(nt => {
        if (t.name === nt) {
          tagIds.push(t.id)
        }
      })
    )
    // blur('tags')
    change('tags', tagIds)
    setSelectTag(newTags)
  }

  const handleModeChange = e => {
    setSelectedMode(e.target.value)
  }
  const handleUpload = (uploaded, change, blur) => {
    // blur('media')
    change('media', uploaded[0])
    setUpload(uploaded[0])
  }
  const onEditorStateChange = (editor, field, change, blur) => {
    // blur(field)
    change(field, editor)
  }
  useEffect(
    () => {
      if (data && data.post) {
        setSelectedMode('post')
      }
    },
    [data]
  )

  return (
    <Paper className={classes.root} elevation={1}>
      <Form
        initialValues={data || {}}
        validate={validate}
        onSubmit={e => e.preventDefault()}
        render={({
          handleSubmit,
          pristine,
          invalid,
          form: { change, blur, getState }
        }) => (
          <form onSubmit={handleSubmit}>
            <div className='mode' style={create ? {} : { display: 'none' }}>
              <span className='modeitem'>
                Link externo
                <Radio
                  checked={selectedMode === 'link'}
                  onChange={handleModeChange}
                  value='link'
                  name='radio-button-link'
                  inputProps={{ 'aria-label': 'Link externo' }}
                />
              </span>
              <span className='modeitem'>
                Novo post
                <Radio
                  checked={selectedMode === 'post'}
                  onChange={handleModeChange}
                  value='post'
                  name='radio-button-post'
                  inputProps={{ 'aria-label': 'Novo post' }}
                />
              </span>
            </div>
            <div className={classes.full}>
              <Typography component='h5' variant='h5'>
                Título {selectedMode === 'link' ? 'da notícia' : 'do post'}
              </Typography>
              <Field
                name={'title'}
                component={OutlineTextField}
                inputType={'text'}
              />
            </div>
            <Typography component='h5' variant='h5'>
              Tags
            </Typography>
            <div className={classes.column}>
              <Field name='tags'>
                {fieldprops => (
                  <MultiSelect
                    {...fieldprops}
                    label={'Selectione as tags deste projeto'}
                    items={tagList}
                    name='tags'
                    create={'Criar nova tag'}
                    createAction={() => Router.push(`/tag_edit`)}
                    setSelected={e =>
                      handleSelectTag(e.target.value, change, blur)
                    }
                    selected={tags || []}
                  />
                )}
              </Field>
            </div>
            {selectedMode === 'post' && (
              <span className='author'>
                {data &&
                  `por ${data.post.author.firstName} ${
                    data.post.author.lastName
                  }`}
              </span>
            )}
            <div className={classes.column}>
              {uploadedImage && <img src={uploadedImage} />}
              {/* {!uploaded && project && project.image && <img src={project.image} />} */}
              {!uploadedImage && <h4>Esta noticia não tem imagem de capa</h4>}
            </div>
            <div className={classNames(classes.column, classes.helper)}>
              <Typography variant='caption'>
                Selecionar imagem de capa
                <br />
                <Field name='media'>
                  {fieldprops => (
                    <Upload
                      {...fieldprops}
                      accept='image/*'
                      name='upload-media'
                      handleUpload={url => handleUpload(url, change, blur)}
                    />
                  )}
                </Field>
              </Typography>
            </div>
            <Divider />
            {selectedMode === 'link' && (
              <div className={classes.column}>
                <Typography component='h5' variant='h5'>
                  Link da notícia
                </Typography>
                <Field
                  name={'link'}
                  component={OutlineTextField}
                  inputType={'text'}
                />
              </div>
            )}
            <div className={classes.full}>
              <Typography component='h5' variant='h5'>
                {selectedMode === 'link'
                  ? 'Introdução da notícia'
                  : 'Introdução do post'}
              </Typography>
              <Field
                name={'intro'}
                component={OutlineTextField}
                inputType={'html'}
                handleEditor={e =>
                  onEditorStateChange(e, 'intro', change, blur)
                }
              />
            </div>
            <div className={classes.full}>
              <Typography component='h5' variant='h5'>
                {selectedMode === 'link' ? 'Descrição da notícia' : 'Post'}
              </Typography>
              <Field
                name={'description'}
                component={OutlineTextField}
                inputType={'html'}
                handleEditor={e =>
                  onEditorStateChange(e, 'description', change, blur)
                }
              />
            </div>
            <Divider />
            <Actions
              goBackUrl={goBackUrl}
              save={update}
              saveVariables={(() => {
                const input = getState().values
                const cleanVars = {}
                Object.keys(input).map(i => {
                  if (i !== '__typename') {
                    Object.assign(cleanVars, { [i]: input[i] })
                  }
                })
                if (selectedMode === 'post') {
                  Object.assign(cleanVars, {
                    post: true
                  })
                }
                return { input: cleanVars }
              })()}
              removeVariables={data ? { id: data.id } : {}}
              remove={remove}
              isEdit={!!data}
              pristine={pristine}
            />
          </form>
        )}
      />
      <style jsx>{`
        img {
          max-width: 300px;
          max-height: 300px;
        }
        .mode {
          padding: 30px 0;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          width: 300px;
          justify-content: space-around;
          margin: 0 auto;
        }
        .modeitem {
          display: flex;
          flex-flow: column;
          align-items: center;
          width: 140px;
        }
      `}</style>
    </Paper>
  )
}

NewsForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(NewsForm)
