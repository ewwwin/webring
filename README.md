# webring server

## run it

no external dependencies! no need to `npm i`! woo!

    cp webring.txt.sample webring.txt && $EDITOR webring.txt
    npm run start

## configuration

the server listens on port `$PORT` (default 80) and loads the list of
participating sites from the file `$SITES_FILE` (default `webring.txt`).

the sites file is a newline-separated list of URLs; leading and trailing
whitespace, empty lines, and lines starting with `#` are ignored. you can test
out the format using [this regexr link](https://regexr.com/?expression=/^\s*([^%23\s].*)\s*$/gm&text=%23%20sample%20SITES_FILE%0A%0A%23%20my%20friend%20alice%20who%20is%20cool%0Ahttps%3A%2F%2Falices.awesome.website%0A%0A%23%20my%20other%20friend%20bob%20who%20is%20neat%20as%20well%0Ahttp%3A%2F%2Fsome.shared.domain%2F~bob%0A&tool=list&input=your.webring.server/next?from=$1\n).

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
