#!/usr/bin/python3

import requests
from urllib.parse import quote_plus as sanitize_this
from urllib.parse import unquote
import json
import os


"""
 Quick and dirty rip of the public data used by evetournaments.com
 because the CREST API was removed, and this should allow the site
 to maintain the existing features.

"""


MAX_TOURNAMENTS = 17  # 1-16
MAX_TEAMS = 356
ROOT = 'https://crest-tq.eveonline.com/'
TOURNAMENT_ROOT = 'https://crest-tq.eveonline.com/tournaments/'




def save(endpoint, jsonStr, stripStr=ROOT, saveDir=None):
    shortened = endpoint.replace(stripStr, '')
    sanitized = sanitize_this(shortened)

    if saveDir:
        sanitized = saveDir + '/' + sanitized
    print('sanitized: {0}'.format(sanitized))
    if os.path.exists(os.path.dirname(sanitized)):
        print('[!!] skipping duplicate: {0}'.format(shortened))
        return
    if not os.path.isdir(shortened):
        print('making')
        os.makedirs(os.path.dirname(shortened), exist_ok=True)

    with open(sanitized, 'w') as fd:
        json.dump(jsonStr, fd)
    print('[I] saved {0}'.format(shortened))


def parse_series(jsData):
    print(jsData)


def main():
    sess = requests.Session()
    root = TOURNAMENT_ROOT
    sess.headers.update({'User-Agent': 'evetournaments.com/scrape.py'})
    rootInfo = json.loads(sess.get(root).text)
    save(root, rootInfo)
    # for tournaments 1-5 you have to hard-code the <#>/series/
    # as the root endpoint for that tournament returns an error


    # tournaments

    for tourn in range(1, MAX_TOURNAMENTS):
        endpoint = root + str(tourn) + '/'
        print(endpoint)
        save(endpoint, json.loads(sess.get(endpoint).text), saveDir='tournaments')
    # teams
    # members
    # matches
    # series
    # bans taken from teams


if __name__ == '__main__':
    main()
