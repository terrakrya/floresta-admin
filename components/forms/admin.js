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
import OutlineTextField from "./OutlineTextField"
import Select from "./Select"

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
    padding: "35px 0"
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

const roles = ["ADMIN", "EDITOR", "READER"]

const AdminForm = ({ classes, update, data, error }) => {
  const goBackUrl = "/admins"
  const [formState, setFormState] = React.useState(data.role || roles[0])
  const handleSelect = (e, change, blur) => {
    console.log("e", e)
    blur("role")
    change("role", e)
    setFormState(e)
  }
  return (
    <Paper className={classes.root} elevation={1}>
      <Form
        initialValues={data ? data : {}}
        onSubmit={async e => {
          const cleanVars = {}
          Object.keys(e).map(i => {
            if (i !== "__typename" && i !== "tableData" && i !== "posts")
              Object.assign(cleanVars, { [i]: e[i] })
          })
          const res = await update({ variables: { input: cleanVars } })
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
            <div className={classes.full}>
              <Typography component='h2' variant='h6'>
                Nome
              </Typography>
              <Field
                name={"firstName"}
                component={OutlineTextField}
                inputType={"text"}
              />
            </div>
            <div className={classes.full}>
              <Typography component='h2' variant='h6'>
                Sobrenome
              </Typography>
              <Field
                name={"lastName"}
                component={OutlineTextField}
                inputType={"text"}
              />
            </div>
            <div className={classes.full}>
              <Typography component='h2' variant='h6'>
                E-mail
              </Typography>
              <Field
                name={"email"}
                component={OutlineTextField}
                inputType={"email"}
              />
            </div>
            <div className={classes.full}>
              <Typography component='h2' variant='h6'>
                Cargo
              </Typography>
              <Select
                name='role'
                component={Select}
                label={"Selecione o cargo para esse usuário"}
                items={roles}
                setSelected={value => handleSelect(value, change, blur)}
                selected={formState}
              />
              {/* <Field
                name={"role"}
                component={OutlineTextField}
                inputType={"text"}
              /> */}
            </div>
            <div className={classes.full}>
              <Typography component='h2' variant='h6'>
                Senha
              </Typography>
              <Field
                name={"password"}
                component={OutlineTextField}
                inputType={"password"}
              />
            </div>
            <Divider />
            <Button
              size='small'
              color='default'
              type='submit'
              // disabled={}
            >
              Salvar usuário
            </Button>
            {error && <h3>Erro, por favor digite a senha</h3>}
            <Button size='small' onClick={() => Router.push(goBackUrl)}>
              Cancelar
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
  )
}

AdminForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(AdminForm)
