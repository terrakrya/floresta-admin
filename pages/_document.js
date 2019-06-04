import React from 'react';
import PropTypes from 'prop-types';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/styles';
import flush from 'styled-jsx/server';
import theme from '../lib/theme';
import jsHttpCookie from 'cookie';

class MyDocument extends Document {
	render() {
		const { token } = this.props;
		return (
			<html lang="pt" dir="ltr">
				<Head>
					<meta charSet="utf-8" />
					{/* Use minimum-scale=1 to enable GPU rasterization */}
					<meta
						name="viewport"
						content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
					/>
					{/* PWA primary color */}
					<meta name="theme-color" content={theme.palette.primary.main} />
					<link async rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
					<link rel="stylesheet" type="text/css" href="/static/nprogress.css" />
					{/* Auth session token */}
					<script
						id="session"
						type="application/json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(token, null, 2)
						}}
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}

MyDocument.getInitialProps = async (ctx) => {
	const { req } = ctx;
	let token;
	if (req && req.headers) {
		const cookies = req.headers.cookie;
		if (typeof cookies === 'string') {
			const cookiesJSON = jsHttpCookie.parse(cookies);
			token = cookiesJSON.periodicos_token;
		}
	}
	// material-ui ssr
	const sheets = new ServerStyleSheets();
	const originalRenderPage = ctx.renderPage;

	ctx.renderPage = () =>
		originalRenderPage({
			enhanceApp: (App) => (props) => sheets.collect(<App {...props} />)
		});
	const initialProps = await Document.getInitialProps(ctx);

	return {
		...initialProps,
		token,
		// Styles fragment is rendered after the app and page rendering finish.
		styles: (
			<React.Fragment>
				{sheets.getStyleElement()}
				{flush() || null}
			</React.Fragment>
		)
	};
};

export default MyDocument;
