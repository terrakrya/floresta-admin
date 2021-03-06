import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Mutation } from 'react-apollo'
import UPLOAD_FILE from '../../queries/uploadFile.gql'
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
})

function dataURLtoFile (dataurl, filename) {
  var arr = dataurl.split(',')

  var mime = arr[0].match(/:(.*?);/)[1]

  var bstr = atob(arr[1])

  var n = bstr.length

  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

const hashCode = string => {
  var hash = 0
  if (string.length == 0) {
    return hash
  }
  for (var i = 0; i < string.length; i++) {
    var char = string.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString()
}

// function makeid(length) {
//   var result = ""
//   var characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
//   var charactersLength = characters.length
//   for (var i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength))
//   }
//   return result
// }

// ReactQuill.Quill
// var toolbar = quill.getModule('toolbar');
// toolbar.addHandler('image', showImageUI);

const imageHandler = () => {
  const { Quill } = require('react-quill')
  console.log(Quill.registerModule)
  // var range = Quill.getSelection().index
  // console.log("RANGE", range)
  // var value = prompt("What is the image URL")
  // if (value) {
  //   this.quillRef.getEditor().insertEmbed(range.index, "image", value, "user")
  // }
}
var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction
  [{ align: [] }],

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  ['link', 'image', 'video'],

  ['clean'] // remove formatting button
]
const modules = {
  toolbar: {
    container: toolbarOptions,
    handlers: {
      // image: () => imageHandler()
    }
  }
}

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'color',
  'background',
  'list',
  'bullet',
  'indent',
  'align',
  'size',
  'link',
  'image',
  'video'
]

export default ({ onEditorStateChange, value, height, maxLength, name }) => {
  const [uploaded, setUploaded] = useState([])
  if (window) {
    return (
      <Mutation mutation={UPLOAD_FILE}>
        {upload => (
          <ReactQuill
            onChange={(content, delta, source, editor) => {
              // console.log(editor.getLength(), maxLength)
              if (!maxLength || editor.getLength() <= maxLength) {
                const contents = editor.getContents()
                const images = contents.ops
                  .filter(c => c.insert.image)
                  .map(c => c.insert.image)
                  .map(async image => {
                    const imageName = hashCode(image)
                    const isBase64 = image.split('image/')
                    if (isBase64[1]) {
                      const format = isBase64[1].split(';')[0]
                      const file = dataURLtoFile(
                        image,
                        `${imageName}.${format}`
                      )
                      await upload({
                        variables: {
                          file
                        }
                      }).then(res => {
                        if (res && res.data.uploadFile) {
                          const url = res.data.uploadFile.url
                          // setUploaded(uploaded.push(name))
                          // console.log(uploaded)
                          const newContent = content.replace(image, url)
                          // console.log("SUBS", newContent)
                          return onEditorStateChange(newContent)
                        }
                      })
                    }
                  })

                return onEditorStateChange(content)
              }
            }}
            name={name}
            defaultValue={value}
            value={value}
            modules={modules}
            formats={formats}
            style={{ height: height, padding: '30px 0' }}
          />
        )}
      </Mutation>
    )
  } else {
    return <input type='textarea' />
  }
}
