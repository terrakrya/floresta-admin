import { Mutation } from "react-apollo"
import UPLOAD_FILE from "../../queries/uploadFile.gql"
import { useState } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Loading from "../Loading"
import Error from "../Error"

const styles = theme => ({
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  }
})

const Upload = ({
  required,
  multiple,
  name,
  accept,
  classes,
  handleUpload,
  meta
}) => {
  const [uploading, toggleupload] = useState(false)
  return (
    <div>
      <Mutation mutation={UPLOAD_FILE}>
        {(upload, { error }) => (
          <div>
            <input
              accept={accept || "*"}
              multiple={multiple || false}
              required={required}
              type='file'
              className={classes.input}
              id={name ? name : "contained-button-file"}
              onChange={({ target: { validity, files } }) => {
                validity.valid
                let urlList = []
                Promise.all(
                  Object.keys(files).map(async fileKey => {
                    const file = files[fileKey]
                    toggleupload(true)
                    await upload({ variables: { file } })
                      .then(res => {
                        if (res && res.data.uploadFile) {
                          const url = res.data.uploadFile.url
                          urlList.push(url)
                        }
                      })
                      .catch(err => {
                        console.log("ERROR!", err)
                        toggleupload(false)
                        return
                      })
                  })
                ).then(i => {
                  handleUpload(urlList)
                  toggleupload(false)
                })
              }}
            />
            <label htmlFor={name ? name : "contained-button-file"}>
              <Button
                variant='contained'
                component='span'
                className={classes.button}
              >
                {uploading ? <Loading /> : ""}
                Upload
              </Button>
              {error && <Error />}
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
