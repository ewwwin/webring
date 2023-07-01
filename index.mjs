import * as fs from 'node:fs';
import http from 'node:http';

const mod = (n, m) => ((n % m) + m) % m;
const stripURL = s => s.replace(/(^https?:\/\/|\/$)/g, '')

const sitesArray = fs.readFileSync('./webring.txt', 'utf-8')
	.match(/(?<!#.*)https?:\/\/[^\s]+(?=\s*$)/gmi)

const sitesLookup = sitesArray.map(stripURL).reduce((acc, current, index) => ({
	...acc, [current]: {
		'/next': sitesArray[mod(index + 1, sitesArray.length)],
		'/prev': sitesArray[mod(index - 1, sitesArray.length)],
	}
}), {})

const redirect = (response, url) => {
	response.setHeader('Location', url)
	response.statusCode = 301
	response.end()
}

const handle = (direction, from, response) => {
	const destination = sitesLookup[stripURL(from)]?.[direction]

	if (destination)
		return redirect(response, destination)

	response.statusCode = 400
	response.end('the provided site is not in the webring')
}

http.createServer((request, response) => {
	const url = new URL(request.url, `http://${request.headers.host}`);

	if (url.pathname === '/prev' || url.pathname === '/next') {
		return handle(url.pathname, url.searchParams.get('from'), response)
	} else if (url.pathname === '/list') {
		return response.setHeader('Content-Type', 'text/plain').end(sitesArray.join('\n'))
	}

	response.statusCode = 404
	response.end('not found')
}).listen(process.env.PORT || 8080)
