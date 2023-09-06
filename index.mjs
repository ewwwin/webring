import {readFileSync} from 'node:fs';
import {createServer} from 'node:http';
import {URL} from 'node:url';

const data = readFileSync(process.env.SITES_FILE || 'webring.txt', 'utf-8');
const sites = [...data.matchAll(/^\s*([^#\s].*)\s*$/gm)].map(match => match[1]);

const text = (response, body, code = 200) => {
	response.writeHead(code, {'Content-Type': 'text/plain'}).write(body);
	response.end();
};
const redirect = (res, url) => res.writeHead(301, {Location: url}).end();

const toSite = (response, from, offset) => {
	const index = sites.findIndex(site => site === from);
	if (!from || index === -1) {
		return text(response, 'the provided site is not in the webring', 400);
	}
	redirect(response, sites[(index + offset + sites.length) % sites.length]);
};

const pathHandlers = {
	'/prev': (response, query) => toSite(response, query.get('from'), -1),
	'/next': (response, query) => toSite(response, query.get('from'), +1),
	'/list': response => text(response, sites.join('\n')),
};
createServer((request, response) => {
	const url = new URL(request.url, `http://${request.headers.host}`);
	pathHandlers[url.pathname]?.(response, url.searchParams);
}).listen(process.env.PORT || 80);
