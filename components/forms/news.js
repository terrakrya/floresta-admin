import React, { useEffect, useState } from "react"
import Router from "next/router"
import { Form, Field } from "react-final-form"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import classNames from "classnames"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import Radio from "@material-ui/core/Radio"
import Divider from "@material-ui/core/Divider"
import Upload from "./Upload"
import OutlineTextField from "./OutlineTextField"
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
    flexBasis: "100%",
    padding: "20px 0",
    margin: "0 auto"
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

const NewsForm = ({ classes, update, data, remove, client, create }) => {
  // const { previousPagePath } = useContext(StateContext)
  const goBackUrl = "/news"
  const [selectedMode, setSelectedMode] = useState("link")
  const [uploadedImage, setUpload] = useState(
    data && data.media ? data.media : null
  )
  const handleModeChange = e => {
    setSelectedMode(e.target.value)
  }
  const handleUpload = (uploaded, change, blur) => {
    blur("media")
    change("media", uploaded[0])
    setUpload(uploaded[0])
  }
  const onEditorStateChange = (editor, field, change, blur) => {
    blur(field)
    change(field, editor)
  }
  useEffect(() => {
    if (data && data.post) {
      setSelectedMode("post")
    }
  }, [data])
  return (
    <Paper className={classes.root} elevation={1}>
      <Form
        initialValues={data ? data : {}}
        onSubmit={async e => {
          const cleanVars = {}
          Object.keys(e).map(i => {
            if (i !== "__typename") Object.assign(cleanVars, { [i]: e[i] })
          })
          if (selectedMode === "post") {
            Object.assign(cleanVars, {
              post: true
            })
          }
          console.log("cleanVars", cleanVars)
          const res = await update({ variables: { input: cleanVars } })
          console.log("RES", res)
          if (res && res.data) {
            Router.push(`${goBackUrl}?refresh`)
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
            <div className='mode' style={create ? {} : { display: "none" }}>
              <span className='modeitem'>
                Link externo
                <Radio
                  checked={selectedMode === "link"}
                  onChange={handleModeChange}
                  value='link'
                  name='radio-button-link'
                  inputProps={{ "aria-label": "Link externo" }}
                />
              </span>
              <span className='modeitem'>
                Novo post
                <Radio
                  checked={selectedMode === "post"}
                  onChange={handleModeChange}
                  value='post'
                  name='radio-button-post'
                  inputProps={{ "aria-label": "Novo post" }}
                />
              </span>
            </div>
            <div className={classes.full}>
              <Typography component='h5' variant='h5'>
                Título {selectedMode === "link" ? "da notícia" : "do post"}
              </Typography>
              <Field
                name={"title"}
                component={OutlineTextField}
                inputType={"text"}
              />
            </div>
            {selectedMode === "post" && (
              <span className='author'>
                por {data.post.author.firstName} {data.post.author.lastName}
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
            {selectedMode === "link" && (
              <div className={classes.column}>
                <Typography component='h5' variant='h5'>
                  Link da notícia
                </Typography>
                <Field
                  name={"link"}
                  component={OutlineTextField}
                  inputType={"text"}
                />
              </div>
            )}
            <div className={classes.full}>
              <Typography component='h5' variant='h5'>
                {selectedMode === "link"
                  ? "Introdução da notícia"
                  : "Introdução do post"}
              </Typography>
              <Field
                name={"intro"}
                component={OutlineTextField}
                inputType={"html"}
                handleEditor={e =>
                  onEditorStateChange(e, "intro", change, blur)
                }
              />
            </div>
            <div className={classes.full}>
              <Typography component='h5' variant='h5'>
                {selectedMode === "link" ? "Descrição da notícia" : "Post"}
              </Typography>
              <Field
                name={"description"}
                component={OutlineTextField}
                inputType={"html"}
                handleEditor={e =>
                  onEditorStateChange(e, "description", change, blur)
                }
              />
            </div>
            <Divider />
            <Button
              size='small'
              color='default'
              type='submit'
              // disabled={}
            >
              Salvar notícia
            </Button>
            <Button size='small' onClick={() => Router.push(goBackUrl)}>
              Cancelar
            </Button>
            {data && (
              <Button
                size='small'
                onClick={async () => {
                  alert("Tem certeza que deseja remover essa notícia?")
                  const res = await remove({ variables: { id: data.id } })
                  console.log("RES", res)
                  // const villages = client.readQuery({ query: VILLAGES });
                  // console.log('villages', villages);
                  // const newList = villages.projectCategories.filter(
                  // 	(i) => i.id !== res.data.removeProjectCategory
                  // );
                  // console.log('newList', newList);
                  // client.writeData({ data: { projectCategories: newList } });
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
