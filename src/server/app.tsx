// delete process.env.BROWSER;

import * as Express from 'express';
import * as React from 'react';
import * as path from 'path';

import { Provider } from 'react-redux';
import { RouterContext, match } from 'react-router';
import { renderToString } from 'react-dom/server';

import { configureStore, Store } from '../common/reducers';
import routes from '../common/routes';
import App from '../common/components/App';
import { renderCSS } from '../common/components/EulerGrid';

import { ProjectEulerModel } from '../common/models/ProjectEuler'

function renderFullPage(initialState: Store, html: string, css: string) {
    return `
   	<!doctype html>
	<html lang="utf-8">
	  <head>
		<title>Phineas' React Blog</title>
		<style>${css}</style>
		<link rel='stylesheet' type='text/css' href='/assets/main.css'/>
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

function parseCSS(selector: string, properties: any, padding = ''): string {
	let nestedBlocks = '';
	let currBlock = '';
	for(let key in properties) {
		if(typeof properties[key] === 'string' ) {
			currBlock += `  ${padding + key}: ${properties[key]};\r\n`
		} else if (typeof properties[key] === 'number'){
			currBlock += `  ${padding + key}: ${String(properties[key])+'px'};\r\n`
		} else if(selector.indexOf('@media') != -1) {
			currBlock += parseCSS(key, properties[key], padding+'  ');
		} else {
			nestedBlocks += parseCSS(selector + key, properties[key]);
		}
	}

	currBlock = `${padding+selector} {\r\n${currBlock+padding}}\r\n`;
	return currBlock + nestedBlocks
}

function extractCSS(projectEuler: ProjectEulerModel) {
	let styles = renderCSS(projectEuler.problems);
	let css = ''
	for(let key in styles) {
		css += parseCSS(key, styles[key])
	}

	return css;
}

const eulerPath = '/Users/phin/Code/project-euler/';
const projectEuler = new ProjectEulerModel({path: eulerPath});

const app = Express();

app.use('/assets', Express.static(process.env.CLIENT_LOC));
app.use((req, res) => {
	console.log(req.url);
	match({routes, location: req.url}, (err, redirectLocation, renderProps) => {
		if (err) {
			res.status(500).send(err.message);
		} else if (redirectLocation) {
			res.redirect(302, redirectLocation.pathname + redirectLocation.search) 
		} else if (renderProps) {
			const store = configureStore({
				euler: {
					active: -1,
					problems: projectEuler.problems,
				},
				windows: []
			});

			 const InitialComponent = (
			 	<Provider store={store}>
			 		<RouterContext {...renderProps as any} /> 
			 	</Provider>
			 )

			 const css = extractCSS(projectEuler);
			 const html = renderToString(InitialComponent);
			
			const initState = store.getState();

			const page = renderFullPage(initState, html, css);

			res.status(200).send(page);
		} else {
			res.status(404).send('not found');
		}
	})	
});

export default app;