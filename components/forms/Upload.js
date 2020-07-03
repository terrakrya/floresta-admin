import { Mutation } from 'react-apollo'
import UPLOAD_FILE from '../../queries/uploadFile.gql'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Loading from '../Loading'
import Error from '../Error'

const defaultMaxFileLimit = 3.5

const styles = theme => ({
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none'
  }
})

const Upload = ({
  required,
  multiple,
  name,
  accept,
  classes,
  handleUpload,
  meta,
  fileSizeLimit
}) => {
  const [uploading, setUpload] = useState(false)
  return (
    <div>
      <Mutation mutation={UPLOAD_FILE}>
        {(upload, { error }) => (
          <div>
            <input
              accept={accept || '*'}
              multiple={multiple || false}
              required={required}
              type='file'
              className={classes.input}
              id={name || 'contained-button-file'}
              onChange={({ target: { validity, files } }) => {
                validity.valid
                let urlList = []
                Promise.all(
                  Object.keys(files).map(async fileKey => {
                    const file = files[fileKey]
                    const fileSize = (file.size / 3500 / 3500).toFixed(4) // MB
                    if (fileSize < (fileSizeLimit || defaultMaxFileLimit)) {
                      setUpload(true)
                      await upload({ variables: { file } })
                        .then(res => {
                          if (res && res.data.uploadFile) {
                            const url = res.data.uploadFile.url
                            urlList.push(url)
                          }
                        })
                        .catch(err => {
                          console.log('ERROR!', err)
                          setUpload(false)
                        })
                    } else {
                      urlList.error = `O arquivo excede o limite de 3Mb por ${fileSize -
                        (fileSizeLimit || defaultMaxFileLimit)}Mb.`
                    }
                  })
                ).then(i => {
                  if (urlList.error) {
                    setUpload({ error: urlList.error })
                  } else {
                    handleUpload(urlList)
                    setUpload(false)
                  }
                })
              }}
            />
            <label htmlFor={name || 'contained-button-file'}>
              <Button
                variant='contained'
                component='span'
                className={classes.button}
              >
                {uploading && !uploading.error ? <Loading /> : ''}
                Upload
              </Button>
              {(uploading.error || error) && (
                <Error message={uploading.error} />
              )}
              {/* <span>{meta.touched ? meta.error : undefined}</span>
			<span>{meta.error && meta.touched}</span> */}
            </label>
          </div>
        )}
      </Mutation>
    </div>
  )
}

Upload.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Upload)
