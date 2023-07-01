# webring server

## run it

    npm i
	cp webring.txt.sample webring.txt && $EDITOR webring.txt
	npm run start

## link to webring sites

participating sites should link to the endpoints `/prev?from=<site>` and
`/next?from=<site>` from their site, where `<site>` is the URL for their site
from `webring.txt`. for example, a site in the webring as
`https://example.net/~someone` should link to
`/prev?from=https://example.net/~someone` and
`/next?from=https://example.net/~someone` on whatever host this server is
accessible from.

## license

[WTFPL](/LICENSE)
