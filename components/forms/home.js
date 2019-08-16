import React, { Component, useState } from "react"
import { Form, Field } from "react-final-form"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import classNames from "classnames"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import Paper from "@material-ui/core/Paper"
import Upload from "./Upload"
import Loading from "../Loading"
import AnyImage from "../AnyImage"
import OutlineTextField from "./OutlineTextField"

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
    display: "flex",
    flexFlow: "column",
    alignItems: "center",
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(1) * 2,
    paddingBottom: theme.spacing(1) * 2
  },
  full: {
    flexBasis: "100%"
  },
  column: {
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "center",
    justifyContent: "space-around",
    flexBasis: "33.33%",
    width: "100%",
    padding: "20px 0"
  }
})

class HomeForm extends Component {
  state = {
    logo: null,
    headerImage: null,
    submitting: false
  }

  clearUpload = () =>
    this.setState({
      logo: null,
      headerImage: null
    })

  toggleSubmit = () => {
    this.setState({ ...this.state, submitting: !this.state.submitting })
  }

  handleUpload = (uploaded, field, change, blur) => {
    blur(field)
    change(field, uploaded[0])
    this.setState({ ...this.state, [field]: uploaded[0] })
  }

  render() {
    const { classes, update, content, refetch } = this.props
    return (
      <Form
        className={classes.root}
        elevation={1}
        initialValues={content}
        onSubmit={async e => {
          this.toggleSubmit()
          let cleanList = {}
          Object.keys(e).map(i => {
            if (Array.isArray(e[i]) && e[i].length > 0) {
              cleanList[i] = e[i]
            } else if (
              (!Array.isArray(e[i]) && e[i] !== null && i === "logo") ||
              i === "headerImage" ||
              i === "subTitle" ||
              i === "title" ||
              i === "youtubeLink" ||
              i === "facebookLink"
            ) {
              cleanList[i] = e[i]
            }
          })
          console.log(cleanList)
          const res = await update({
            variables: { input: cleanList }
          })
          console.log("RES", res)
          if (res && res.data) {
            refetch()
            this.toggleSubmit()
            this.clearUpload()
          }
        }}
        validate={validate}
        render={({
          handleSubmit,
          pristine,
          invalid,
          form: { change, blur }
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
                  background: "rgba(0,0,0,.5)",
                  width: 300,
                  margin: "25px auto"
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
                          this.handleUpload(url, "logo", change, blur)
                        }
                      />
                    )}
                  </Field>
                </Typography>
              </div>
              <div className={classes.column}>
                <Typography component='h3' variant='h3'>
                  Imagem de capa
                </Typography>
              </div>
              <div
                className={classes.column}
                style={{
                  maxWidth: 600,
                  margin: "25px auto"
                }}
              >
                {((content && content.headerImage) ||
                  this.state.headerImage) && (
                  <AnyImage
                    src={this.state.headerImage || content.headerImage}
                    size='550px'
                  />
                )}
                {!this.state.headerImage &&
                  !(content && content.headerImage) && (
                    <h4>Sem imagem de capa...</h4>
                  )}
              </div>
              <div className={classNames(classes.column, classes.helper)}>
                <Typography variant='caption'>
                  Suba uma imagem para atualizar a imagem de capa
                  <br />
                  <Field name='headerImage'>
                    {fieldprops => (
                      <Upload
                        {...fieldprops}
                        accept='image/*'
                        name='headerImage'
                        handleUpload={url =>
                          this.handleUpload(url, "headerImage", change, blur)
                        }
                      />
                    )}
                  </Field>
                </Typography>
              </div>
              <div style={{ flexBasis: "100%" }}>
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
              </div>
              <Divider />
              <div className={classes.column}>
                <Button size='small'>Cancel</Button>
                <Button
                  size='small'
                  color='primary'
                  type='submit'
                  disabled={pristine || invalid}
                >
                  {this.state.submitting ? <Loading /> : ""}
                  Salvar
                </Button>
              </div>
            </Paper>
            <style jsx>{`
              img {
                max-width: 150px;
                max-height: 150px;
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
