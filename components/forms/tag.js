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
import Upload from "./Upload"
import OutlineTextField from "./OutlineTextField"
import TAGS from "../../queries/tags.gql"
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

const TagForm = ({
  classes,
  onSubmit,
  project,
  update,
  data,
  remove,
  client
}) => {
  const { previousPagePath } = React.useContext(StateContext)
  const goBackUrl = "/tags"

  const initialMedia = data && data.media ? data.media : null
  const [uploadedImage, setUpload] = React.useState(initialMedia)
  const clearUpload = () => setUpload([])

  const handleUpload = (uploaded, change, blur) => {
    blur("media")
    change("media", uploaded[0])
    setUpload(uploaded[0])
  }

  const onEditorStateChange = (editor, type, change, blur) => {
    blur(type)
    change(type, editor)
  }
  return (
    <Paper className={classes.root} elevation={1}>
      <Form
        initialValues={data ? data : {}}
        onSubmit={async e => {
          const cleanVars = {}
          Object.keys(e).map(i => {
            if (i !== "__typename" && i !== "tableData")
              Object.assign(cleanVars, { [i]: e[i] })
          })
          const res = await update({ variables: { input: cleanVars } })
          if (res && res.data) {
            // const tags = client.readQuery({ query: TAGS });
            // console.log('NEW DATA', res.data.saveProjectTag);
            // const newList = tags.projectTags.concat(res.data.saveProjectTag);
            // console.log('newList', newList);
            // client.writeData({ data: { projectTags: newList } });
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
              Nome da tag
            </Typography>
            <Field
              name={"name"}
              component={OutlineTextField}
              inputType={"text"}
            />
            <Typography component='h5' variant='h5'>
              Intro da tag
            </Typography>
            <Field
              name={"intro"}
              component={OutlineTextField}
              inputType={"html"}
              handleEditor={e => onEditorStateChange(e, "intro", change, blur)}
            />
            <Typography component='h5' variant='h5'>
              Descrição da tag
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
                Imagem de capa
              </Typography>
            </div>
            <div className={classes.column}>
              {uploadedImage && <img src={uploadedImage} />}
              {/* {!uploaded && project && project.image && <img src={project.image} />} */}
              {!uploadedImage && <h4>Esta tag não tem imagem de capa</h4>}
            </div>
            <div className={classNames(classes.column, classes.helper)}>
              <Typography variant='caption'>
                Selecionar imagem de capa
                <br />
                <Field name='image'>
                  {fieldprops => (
                    <Upload
                      {...fieldprops}
                      accept='image/*'
                      handleUpload={url => handleUpload(url, change, blur)}
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
              Salvar tag
            </Button>
            <Button size='small' onClick={() => Router.push(goBackUrl)}>
              Cancelar
            </Button>
            {data && (
              <Button
                size='small'
                onClick={async () => {
                  alert("Tem certeza que deseja remover essa tag?")
                  const res = await remove({ variables: { id: data.id } })
                  console.log("RES", res)
                  // const tags = client.readQuery({ query: TAGS });
                  // console.log('tags', tags);
                  // const newList = tags.projectTags.filter((i) => i.id !== res.data.removeProjectTag);
                  // console.log('newList', newList);
                  // client.writeData({ data: { projectTags: newList } });
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
        img {
          max-width: 300px;
          max-height: 300px;
        }
      `}</style>
    </Paper>
  )
}

TagForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(TagForm)
