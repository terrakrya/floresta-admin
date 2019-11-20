import React, { useState } from "react"
import { Query, Mutation } from "react-apollo"
import { Form, Field } from "react-final-form"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import classNames from "classnames"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import OutlineTextField from "./OutlineTextField"
import CONTENT from "../../queries/content.gql"
import SAVE_CONTENT from "../../queries/saveContent.gql"
import Loading from "../Loading"
import Error from "../Error"

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

const contentForm = ({ classes, update, title, field, client, style }) => {
  const [submitting, toggleSubmit] = useState(false)
  const onEditorStateChange = (editor, change, blur) => {
    // blur(field)
    change(field, editor)
  }
  return (
    <Mutation mutation={SAVE_CONTENT}>
      {(update, { error: errorUpdate, client: clientUpdate }) => (
        <Query query={CONTENT}>
          {({
            loading: loadingContent,
            error: errorContent,
            data: dataContent,
            refetch
          }) => {
            if (loadingContent) return <Loading />
            if (errorContent) return <Error />
            {
              if (dataContent) {
                const data = dataContent.content
                return (
                  <div>
                    <Paper className={classes.root} elevation={1} style={style}>
                      <Form
                        initialValues={data ? data : {}}
                        onSubmit={async e => {
                          toggleSubmit(true)
                          const cleanVars = {}
                          Object.keys(e).map(i => {
                            if (i === field)
                              Object.assign(cleanVars, { [i]: e[i] })
                          })
                          console.log("cleanVars", cleanVars)
                          const res = await update({
                            variables: { input: cleanVars }
                          })
                          console.log("RES", res)
                          if (res && res.data) {
                            refetch()
                            toggleSubmit(false)
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
                            <Typography component='h5' variant='h5'>
                              {title}
                            </Typography>
                            <Field
                              name={field}
                              component={OutlineTextField}
                              inputType={"html"}
                              handleEditor={e =>
                                onEditorStateChange(e, change, blur)
                              }
                            />
                            <Divider />
                            <Button
                              size='small'
                              color='default'
                              type='submit'
                              // disabled={}
                            >
                              {submitting ? <Loading /> : ""}
                              Salvar
                            </Button>
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
                  </div>
                )
              }
            }
          }}
        </Query>
      )}
    </Mutation>
  )
}

contentForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(contentForm)
