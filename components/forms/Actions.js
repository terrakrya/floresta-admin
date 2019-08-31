import Router from 'next/router'
import { useState } from 'react'
import Button from '@material-ui/core/Button'
import Loading from '../Loading'
import Error from '../Error'

const doSave = async ({
  setSubmitting,
  setError,
  save,
  variables,
  goBackUrl
}) => {
  setSubmitting(true)
  let res
  try {
    res = await save({ variables })
  } catch (err) {
    console.log(err.networkError)
    setError(err)
    setSubmitting(false)
  }
  // console.log('RES', res)
  if (res && res.data) {
    setSubmitting(false)
    Router.push(`${goBackUrl}?refresh`)
  }
}

const doRemove = async ({
  remove,
  variables,
  setSubmitting,
  setError,
  goBackUrl
}) => {
  alert('Tem certeza que deseja remover essa notícia?')
  setSubmitting(true)
  let res
  try {
    res = await remove({ variables })
  } catch (err) {
    console.log('ERROR', err)
    console.log(err)
    setError(err)
    setSubmitting(false)
  }
  // console.log('RES', res)
  if (res.data) {
    setSubmitting(false)
    Router.push(`${goBackUrl}?refresh`)
  }
}

const SaveButton = props => {
  const [submitting, setSubmitting] = useState(false)
  return (
    <Button
      size='small'
      color='default'
      type='submit'
      onClick={e => {
        e.preventDefault()
        doSave({
          ...props,
          variables: props.saveVariables,
          setSubmitting
        })
      }}
      disabled={props.pristine}
    >
      {submitting ? <Loading /> : 'Salvar'}
    </Button>
  )
}

const RemoveButton = props => {
  const [submitting, setSubmitting] = useState(false)
  return (
    <Button
      size='small'
      color='default'
      type='submit'
      onClick={e => {
        e.preventDefault()
        doRemove({
          ...props,
          variables: props.removeVariables,
          setSubmitting
        })
      }}
      disabled={props.pristine}
    >
      {submitting ? <Loading /> : 'Remover'}
    </Button>
  )
}

export default props => {
  const [error, setError] = useState(false)
  return (
    <div>
      <SaveButton {...props} setError={setError} />
      <Button size='small' onClick={() => Router.push(props.goBackUrl)}>
        Cancelar
      </Button>
      {props.isEdit && <RemoveButton {...props} setError={setError} />}
      {error && <Error errors={error} />}
    </div>
  )
}
