# eve-tournaments

"The deadline in question is May 8th, 2018. On this date, we’ll be shutting down the XML and CREST APIs. Team Tech Co does not take this decision lightly, and we want you to understand why we have made this decision." [source](https://developers.eveonline.com/blog/article/important-information-on-the-future-of-the-eve-api) *no mention of tournament parity...*

Originally this was just going to be a demo showing some public CREST API data, and a possible use case for it. Since then CCP announced the ESI API which will replace both the CREST API and the older XML API. CCP AquarHEAD [replied](https://github.com/ccpgames/esi-issues/issues/296) with a possibly different direction for the endpoints moving forward. So if/when something happens and the data is updated for ESI, I will update and make this demo more legitimate. CCPlease.

Displaying public CREST data grouped by endpoint

```bash
$ npm install
$ node server.js
```

# endpoints
- /tournaments/
- /tournaments/teams/`<id>`/
- /tournaments/`<id>`/series/
- /tournaments/`<idX>`/series/`<idY>`/matches/
- Eventually contributed to the [docs](https://github.com/ccpgames/eveonline-third-party-documentation/blame/master/docs/crest/eve/eve_tournaments.md)

- will migrate to ESI api when CCP migrates Tournament endpoints. Facelift to happen CCPSoon(tm)

- also hosted on [gh-pages](https://jonobrien.io/evetournaments.com/tournaments.html)

## CCP [Developer License](https://developers.eveonline.com/resource/license-agreement)
