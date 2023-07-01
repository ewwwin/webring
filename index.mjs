import * as fs from 'node:fs';
import express from 'express';

const sites = fs.readFileSync('./webring.txt', 'utf-8')
	// split lines
	.split(/\r?\n/)
	// trim whitespace from each line
	.map(site => site.trim())
	// exclude empty lines and lines that start with # because why not
	.filter(site => site && !site.startsWith('#'));

console.log(sites);

// modulo that does the right thing with negatives
// https://stackoverflow.com/a/4467559
const mod = (n, m) => ((n % m) + m) % m;

function handle (offset, request, response) {
	const from = request.query.from;
	const index = sites.findIndex(site => site === from);
	if (!from || index === -1) {
		response.status(400).send('the provided site is not in the webring');
		return;
	}
	response.redirect(301, sites[mod(index + offset, sites.length)]);
}

express()
	.get('/prev', (request, response) => handle(-1, request, response))
	.get('/next', (request, response) => handle(+1, request, response))
	.get('/list', (_, response) => response.type('txt').send(sites.join('\n')))
	.listen(process.env.PORT || 8080, () => {
		console.log('doing the thing');
	})
