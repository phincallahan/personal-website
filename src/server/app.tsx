import * as Express from 'express';
import * as React from 'react';
import * as path from 'path';

import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router'
import { RouterContext } from 'react-router-dom';
import * as ReactDOMServer from 'react-dom/server';

import { configureStore, Store } from '../common/reducers';
import App from '../common/components/App';

import { Euler } from '../common/models/ProjectEuler'

import { readFileSync, readdirSync } from 'fs';

function renderFullPage(initialState: Store, html: string) {
    return `
   	<!doctype html>
	<html lang="utf-8">
	  <head>
		<title>Phineas' React Blog</title>
		<link rel="stylesheet" href="/assets/shoelace.css">
		<link rel='stylesheet' type='text/css' href='/assets/main.css'/>
		<style>
			main {
				max-width: 45rem;
				margin: auto;
				padding: 2rem;
			}
		</style>
	  </head>
	  <body>
	    <div id="react-view">${html}</div>
		<script>
			window.$REDUX_STATE = ${JSON.stringify(initialState)};
		</script>
		<script src="/assets/client.js"></script>
	  </body>
	</html> 
    `
}

const app = Express();
const eulerSolutions = JSON.parse(readFileSync('build/euler.json').toString());

app.use('/assets', Express.static(path.join(process.cwd(), '/build/assets')));
app.use((req, res) => {
	var location = req.url

	const store = configureStore({
		euler: {
			active: -1,
			solutions: eulerSolutions
		},
		windows: []
	});

	var context: { url?: string } = {}
	const html = ReactDOMServer.renderToString(
		<Provider store={store}>
			<StaticRouter location={req.url} context={context}>
				<App/>
			</StaticRouter>
		</Provider> 
	)

	if (context.url) {
		res.writeHead(301, { Location: context.url });
	} else {
		const initState = store.getState();
		const page = renderFullPage(initState, html);
		res.write(page);
	}

	res.end();
});

export default app;