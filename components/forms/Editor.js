import dynamic from "next/dynamic"

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" }
    ],
    ["link", "image", "video"],
    ["clean"]
  ]
}

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video"
]

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false
})

export default ({ onEditorStateChange, value }) => {
  if (window) {
    return (
      <ReactQuill
        onChange={e => onEditorStateChange(e)}
        defaultValue={value}
        value={value}
        modules={modules}
        formats={formats}
      />
    )
  } else {
    return <input type='textarea' />
  }
}
