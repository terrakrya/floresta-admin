import ReactSVG from 'react-svg';

export default ({ src, size }) => {
	if (src && src.split('.')[src.split('.').length - 1] === 'svg') {
		return <ReactSVG src={src} style={{ width: size }} />;
	} else {
		return <img src={src} style={{ width: size }} />;
	}
};
