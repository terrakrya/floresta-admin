import { useEffect } from "react"
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
import VILLAGES from "../../queries/villages.gql"
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
    width: "100%",
    padding: "20px 0"
  }
})

const VillageForm = ({ classes, update, data, remove, client }) => {
  const goBackUrl = "/villages"
  const initialMedia = data && data.media ? data.media : null
  const initialPhotos = data && data.photos ? data.photos : []
  const [uploadedImage, setUpload] = React.useState(initialMedia)
  const [uploadedPhotos, setPhotosUpload] = React.useState(initialPhotos)

  const handleUpload = (uploaded, change, blur) => {
    // blur("media")
    change("media", uploaded[0])
    setUpload(uploaded[0])
  }
  const handlePhotosUpload = (uploaded, change, blur) => {
    const newList = uploadedPhotos.concat(uploaded)
    // blur("photos")
    change("photos", newList)
    setPhotosUpload(newList)
  }

  const onEditorStateChange = (editor, type, change, blur) => {
    // blur(type)
    change(type, editor)
  }

  return (
    <Paper className={classes.root} elevation={1}>
      <Form
        initialValues={data ? data : {}}
        onSubmit={async e => {
          const cleanVars = {}
          Object.keys(e).map(i => {
            if (i !== "__typename") Object.assign(cleanVars, { [i]: e[i] })
          })
          console.log("cleanVars", cleanVars)
          const res = await update({ variables: { input: cleanVars } })
          console.log("RES", res)
          if (res && res.data) {
            // const villages = client.readQuery({ query: VILLAGES });
            // const newList = villages.projectCategories.concat(res.data.saveProjectCategory);
            // console.log('newList', newList);
            // client.writeData({ data: { projectCategories: newList } });
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
              Nome da aldeia
            </Typography>
            <Field
              name={"name"}
              component={OutlineTextField}
              inputType={"text"}
            />
            <Typography component='h5' variant='h5'>
              Link no mapa
            </Typography>
            <Field
              name={"mapLink"}
              component={OutlineTextField}
              inputType={"text"}
            />
            {/* <Typography component='h5' variant='h5'>
              Introdução da aldeia
            </Typography>
            <Field
              name={"intro"}
              component={OutlineTextField}
              inputType={"html"}
              handleEditor={e => onEditorStateChange(e, "intro", change, blur)}
            />
            <Typography component='h5' variant='h5'>
              Descrição da aldeia
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
              {!uploadedImage && <h4>Esta aldeia não tem imagem de capa</h4>}
            </div> */}
            <div className={classNames(classes.column, classes.helper)}>
              <Typography variant='caption'>
                Selecionar imagem de capa
                <br />
                <Field name='image'>
                  {fieldprops => (
                    <Upload
                      name='village-media-upload'
                      {...fieldprops}
                      accept='image/*'
                      handleUpload={url => handleUpload(url, change, blur)}
                    />
                  )}
                </Field>
              </Typography>
            </div>
            <div className={classes.column}>
              <Typography component='h4' variant='h4'>
                Fotos da aldeia
              </Typography>
            </div>
            <div className={classNames(classes.column, classes.helper)}>
              <Typography variant='caption'>
                Selecionar fotos da aldeia
                <br />
                {uploadedPhotos &&
                  uploadedPhotos.map((p, key) => (
                    <img
                      key={key}
                      src={p}
                      style={{ maxWidth: `${100 / uploadedPhotos.length}%` }}
                    />
                  ))}
                <Field name='photos'>
                  {fieldprops => (
                    <Upload
                      name='village-photos-upload'
                      {...fieldprops}
                      accept='image/*'
                      multiple={true}
                      handleUpload={url =>
                        handlePhotosUpload(url, change, blur)
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
              Salvar aldeia
            </Button>
            <Button size='small' onClick={() => Router.push(goBackUrl)}>
              Cancelar
            </Button>
            {data && (
              <Button
                size='small'
                onClick={async () => {
                  alert("Tem certeza que deseja remover essa aldeia?")
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
      `}</style>
    </Paper>
  )
}

VillageForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(VillageForm)
