import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), {
	ssr: false
});

export default ({ onEditorStateChange, value }) => {
	if (window) {
		return <ReactQuill onChange={(e) => onEditorStateChange(e)} defaultValue={value} />;
	} else {
		return <input type="textarea" />;
	}
};
