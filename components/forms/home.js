import React, { Component, useState } from 'react'
import { Form, Field } from 'react-final-form'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Upload from './Upload'
import Loading from '../Loading'
import Actions from './Actions'
import AnyImage from '../AnyImage'
import OutlineTextField from './OutlineTextField'

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
    flexBasis: '100%'
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

class HomeForm extends Component {
  state = {
    logo: null,
    headerImages: [],
    submitting: false
  }

  clearUpload = () =>
    this.setState({
      logo: null
      // headerImages: []
    })

  toggleSubmit = () => {
    this.setState({ ...this.state, submitting: !this.state.submitting })
  }

  handleUpload = (uploaded, field, change, blur) => {
    // blur(field)
    const upload =
      field === 'headerImages'
        ? this.state.headerImages.concat(uploaded)
        : uploaded[0]
    change(field, upload)
    this.setState({ ...this.state, [field]: upload })
  }

  componentDidMount () {
    if (this.props.content && this.props.content.headerImages) {
      this.setState({
        headerImages: this.props.content.headerImages.concat(
          this.state.headerImages
        )
      })
    }
  }

  render () {
    const { classes, update, content, refetch } = this.props
    const { headerImages } = this.state
    return (
      <Form
        className={classes.root}
        elevation={1}
        initialValues={content}
        onSubmit={async e => {
          // this.toggleSubmit()
          // let cleanList = {}
          // Object.keys(e).map(i => {
          //   if (Array.isArray(e[i]) && e[i].length > 0) {
          //     cleanList[i] = e[i]
          //   } else if (
          //     (!Array.isArray(e[i]) && e[i] !== null && i === 'logo') ||
          //     i === 'headerImages' ||
          //     i === 'subTitle' ||
          //     i === 'title' ||
          //     i === 'youtubeLink' ||
          //     i === 'facebookLink' ||
          //     i === 'flickrLink' ||
          //     i === 'instagramLink'
          //   ) {
          //     cleanList[i] = e[i]
          //   }
          // })
          // console.log(cleanList)
          // const res = await update({
          //   variables: { input: cleanList }
          // })
          // console.log('RES', res)
          // if (res && res.data) {
          //   refetch()
          //   this.toggleSubmit()
          //   this.clearUpload()
          // }
        }}
        validate={validate}
        render={({
          handleSubmit,
          pristine,
          invalid,
          form: { change, blur, getState }
        }) => (
          <form onSubmit={handleSubmit}>
            <Paper>
              <div className={classes.column}>
                <Typography component='h3' variant='h3'>
                  Logo
                </Typography>
              </div>
              <div
                className={classes.column}
                style={{
                  background: 'rgba(0,0,0,.5)',
                  width: 300,
                  margin: '25px auto'
                }}
              >
                {((content && content.logo) || this.state.logo) && (
                  <AnyImage src={this.state.logo || content.logo} />
                )}
                {!this.state.logo && !(content && content.logo) && (
                  <h4>Sem logo...</h4>
                )}
              </div>
              <div className={classNames(classes.column, classes.helper)}>
                <Typography variant='caption'>
                  Suba uma imagem para atualizar o logo
                  <br />
                  <Field name='logo'>
                    {fieldprops => (
                      <Upload
                        {...fieldprops}
                        accept='image/*'
                        name='logo'
                        handleUpload={url =>
                          this.handleUpload(url, 'logo', change, blur)
                        }
                      />
                    )}
                  </Field>
                </Typography>
              </div>
              <div className={classes.column}>
                <Typography component='h3' variant='h3'>
                  Imagens de capa
                </Typography>
              </div>
              <div
                className={classes.column}
                style={{
                  maxWidth: 600,
                  margin: '25px auto'
                }}
              >
                {headerImages.map((image, key) => (
                  <AnyImage src={image} size='250px' key={key} />
                ))}
                {headerImages.length === 0 && <h4>Sem imagem de capa...</h4>}
              </div>
              <div className={classNames(classes.column, classes.helper)}>
                <Typography variant='caption'>
                  Suba as imagens na ordem em que gostaria que apareçam na tela
                  de início
                  <br />
                  <div className='slider-upload'>
                    <Field name='headerImages'>
                      {fieldprops => (
                        <Upload
                          {...fieldprops}
                          accept='image/*'
                          name='headerImages'
                          handleUpload={url =>
                            this.handleUpload(url, 'headerImages', change, blur)
                          }
                        />
                      )}
                    </Field>
                    <Button
                      size='small'
                      onClick={() =>
                        this.setState({
                          headerImages: []
                        })
                      }
                    >
                      Limpar
                    </Button>
                  </div>
                </Typography>
              </div>
              <div style={{ flexBasis: '100%' }}>
                <div className={classes.full}>
                  <Field
                    name='title'
                    component={OutlineTextField}
                    inputType='text'
                    label='Título'
                    fullWidth
                  />
                </div>
                <div className={classes.full}>
                  <Field
                    name='subTitle'
                    component={OutlineTextField}
                    inputType='text'
                    label='Frase'
                    fullWidth
                  />
                </div>
                <div className={classes.full}>
                  <Field
                    name='facebookLink'
                    component={OutlineTextField}
                    inputType='text'
                    label='url Facebook'
                    fullWidth
                  />
                </div>
                <div className={classes.full}>
                  <Field
                    name='youtubeLink'
                    component={OutlineTextField}
                    inputType='text'
                    label='url Youtube'
                    fullWidth
                  />
                </div>
                <div className={classes.full}>
                  <Field
                    name='flickrLink'
                    component={OutlineTextField}
                    inputType='text'
                    label='url Flickr'
                    fullWidth
                  />
                </div>
                <div className={classes.full}>
                  <Field
                    name='instagramLink'
                    component={OutlineTextField}
                    inputType='text'
                    label='url Instagram'
                    fullWidth
                  />
                </div>
              </div>
              <Divider />
              <div className={classes.column}>
                <Actions
                  save={update}
                  saveVariables={(() => {
                    // this.toggleSubmit()
                    const input = getState().values
                    let cleanVars = {}
                    Object.keys(input).map(i => {
                      if (Array.isArray(input[i]) && input[i].length > 0) {
                        cleanVars[i] = input[i]
                      } else if (
                        (!Array.isArray(input[i]) &&
                          input[i] !== null &&
                          i === 'logo') ||
                        i === 'headerImages' ||
                        i === 'subTitle' ||
                        i === 'title' ||
                        i === 'youtubeLink' ||
                        i === 'facebookLink' ||
                        i === 'flickrLink' ||
                        i === 'instagramLink'
                      ) {
                        cleanVars[i] = input[i]
                      }
                    })
                    return { input: cleanVars }
                  })()}
                  pristine={getState().pristine}
                />
              </div>
            </Paper>
            <style jsx>{`
              img {
                max-width: 150px;
                max-height: 150px;
              }
              .slider-upload {
                display: flex;
                flex-flow: row nowrap;
              }
            `}</style>
          </form>
        )}
      />
    )
  }
}

HomeForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(HomeForm)
