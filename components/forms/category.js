import React, { Component } from "react"
import Router from "next/router"
import { Form, Field } from "react-final-form"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import classNames from "classnames"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"

import AnyImage from "../AnyImage"
import Upload from "./Upload"
import OutlineTextField from "./OutlineTextField"
import CATEGORIES from "../../queries/categories.gql"
import StateContext from "../../lib/StateContext"

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
    width: "100%"
  }
})

const CategoryForm = ({ classes, update, data, remove, client }) => {
  const goBackUrl = "/categories"
  const initialImages = {
    icon: data && data.icon ? data.icon : null,
    media: data && data.media ? data.media : null
  }
  const [uploadedImages, setUpload] = React.useState(initialImages)
  const clearUpload = () => setUpload({ icon: null, media: null })
  const handleUpload = (type, uploaded, change, blur) => {
    blur(type)
    change(type, uploaded[0])
    setUpload({
      ...uploadedImages,
      [type]: uploaded[0]
    })
  }

  const onEditorStateChange = (editor, field, change, blur) => {
    blur(field)
    change(field, editor)
  }
  return (
    <Paper className={classes.root} elevation={1}>
      <Form
        initialValues={data ? data : {}}
        onSubmit={async e => {
          const cleanVars = {}
          Object.keys(e).map(i => {
            if (
              i !== "__typename" &&
              i !== "id" &&
              i !== "slug" &&
              i !== "tableData" &&
              i !== "createdAt"
            )
              Object.assign(cleanVars, { [i]: e[i] })
          })
          const res = await update({ variables: { input: cleanVars } })
          console.log("RES", res)
          if (res && res.data) {
            // const categories = await client.readQuery({ query: CATEGORIES })
            // const newList = categories.projectCategories.concat(
            //   res.data.saveProjectCategory
            // )
            // client.writeData({ data: { projectCategories: newList } })
            Router.push(`${goBackUrl}?refresh`)
          }
          // let cleanList = {};
          // await onSubmit(cleanList);
          // clearUpload();
        }}
        validate={validate}
        render={({
          handleSubmit,
          pristine,
          invalid,
          form: { change, blur }
        }) => (
          <form onSubmit={handleSubmit}>
            <Typography component='h5' variant='h5'>
              Nome da categoria
            </Typography>
            <Field
              name={"name"}
              component={OutlineTextField}
              inputType={"text"}
            />
            <Typography component='h5' variant='h5'>
              Intro da categoria
            </Typography>
            <Field
              name={"intro"}
              component={OutlineTextField}
              inputType={"html"}
              handleEditor={e => onEditorStateChange(e, "intro", change, blur)}
            />
            <Typography component='h5' variant='h5'>
              Descrição da categoria
            </Typography>
            <Field
              name={"description"}
              component={OutlineTextField}
              inputType={"html"}
              handleEditor={e =>
                onEditorStateChange(e, "description", change, blur)
              }
            />
            <div className={classes.column}>
              <Typography component='h4' variant='h4'>
                Imagens
              </Typography>
            </div>
            <div className={classes.column}>
              {uploadedImages.media && <img src={uploadedImages.media} />}
              {!uploadedImages.media && (
                <h4>Esta categoria não tem imagem de capa</h4>
              )}
            </div>
            <div className={classNames(classes.column, classes.helper)}>
              <Typography variant='caption'>
                Selecionar imagem de capa
                <br />
                <Field name='media'>
                  {fieldprops => (
                    <Upload
                      {...fieldprops}
                      accept='image/.svg,.png'
                      name='upload-media'
                      handleUpload={url =>
                        handleUpload("media", url, change, blur)
                      }
                    />
                  )}
                </Field>
              </Typography>
            </div>
            <Divider />
            <div className={classes.column}>
              {uploadedImages.icon && (
                <span className='icon'>
                  <AnyImage src={uploadedImages.icon} size='30px' />
                </span>
              )}
              {/* {!uploaded && project && project.image && <img src={project.image} />} */}
              {!uploadedImages.icon && <h4>Esta categoria não tem ícone</h4>}
            </div>
            <div className={classNames(classes.column, classes.helper)}>
              <Typography variant='caption'>
                Selecionar ícone
                <br />
                <Field name='icon'>
                  {fieldprops => (
                    <Upload
                      {...fieldprops}
                      accept='image/*'
                      name='upload-icon'
                      handleUpload={url =>
                        handleUpload("icon", url, change, blur)
                      }
                    />
                  )}
                </Field>
              </Typography>
            </div>
            <Divider />
            <Button
              size='small'
              color='default'
              type='submit'
              // disabled={}
            >
              Salvar categoria
            </Button>
            <Button size='small' onClick={() => Router.push(goBackUrl)}>
              Cancelar
            </Button>
            {data && (
              <Button
                size='small'
                onClick={async () => {
                  alert("Tem certeza que deseja remover essa categoria?")
                  const res = await remove({ variables: { id: data.id } })
                  console.log("RES", res)
                  const categories = client.readQuery({ query: CATEGORIES })
                  console.log("categories", categories)
                  const newList = categories.projectCategories.filter(
                    i => i.id !== res.data.removeProjectCategory
                  )
                  console.log("newList", newList)
                  client.writeData({ data: { projectCategories: newList } })
                  Router.push(`${goBackUrl}?refresh`)
                }}
              >
                Remover
              </Button>
            )}
          </form>
        )}
      />
      <style jsx>{`
        .icon {
          width: 30px;
        }
        img {
          max-width: 300px;
          max-height: 300px;
        }
      `}</style>
    </Paper>
  )
}

CategoryForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(CategoryForm)
