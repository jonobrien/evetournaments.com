#!/usr/bin/python3

import requests
from urllib.parse import quote_plus as sanitize_this
from urllib.parse import unquote
import json
import time
import os


"""
 Quick and dirty rip of the public data used by evetournaments.com
 because the CREST API was removed, and this should allow the site
 to maintain the existing features.

"""


MAX_TOURNAMENTS = 17  # 1-16
MAX_TEAMS = 357  # 356 + 1 check manually online for it /teams/ 'totalCount_str'
ROOT = 'https://crest-tq.eveonline.com/'
TOURNAMENT_ROOT = 'https://crest-tq.eveonline.com/tournaments/'




def save(endpoint, jsonStr, stripStr=ROOT, saveDir=None):
    shortened = endpoint.replace(stripStr, '')
    sanitized = sanitize_this(shortened)

    if saveDir:
        sanitized = saveDir + '/' + sanitized

    name = shortened[:-1] + '.json'
    if os.path.isfile(name):
        print('[!!] already have: {0}'.format(name))
        return
    print('sanitized: {0}'.format(sanitized))
    print('shortened: {0}'.format(shortened))
    print(os.path.dirname(shortened))
    if not os.path.isdir(shortened):
        print('making')  # a whole bunch of redundant folders because yes
        os.makedirs(os.path.dirname(shortened), exist_ok=True)  # need this just for series/matches in tournaments
    name = shortened[:-1] + '.json'
    print('[I] saving: {0}'.format(name))
    with open(name, 'w') as fd:
        json.dump(jsonStr, fd)


def main():
    sess = requests.Session()
    root = TOURNAMENT_ROOT
    sess.headers.update({'User-Agent': 'evetournaments.com/scrape.py'})
    rootInfo = json.loads(sess.get(root).text)
    save(root, rootInfo)
    # for tournaments 1-5 you have to hard-code the <#>/series/
    # as the root endpoint for that tournament returns an error
    # but get them all anyway

    # teams returns ship and character images
    # image urls use http not https


    """ /tournaments/idX/ """
    for tourn in range(1, MAX_TOURNAMENTS):
        endpoint = root + str(tourn) + '/'
        save(endpoint, json.loads(sess.get(endpoint).text), saveDir='tournaments')

    """ /tournaments/teams/idX/ """
    for team in range(1, MAX_TEAMS): 
        endpoint = root + 'teams/' + str(team) + '/'
        save(endpoint, json.loads(sess.get(endpoint).text), saveDir='teams')

    """ /tournaments/idX/series/ """
    for tourn in range(1, MAX_TOURNAMENTS):
        endpoint = root + str(tourn) + '/series/'  # series is the number of matches
        data = json.loads(sess.get(endpoint).text)
        save(endpoint, data, saveDir='tournaments/{0}/series')

        """ /tournaments/idX/series/idY/matches/ """
        for series in range(data['totalCount']):  # 0-end (proper range here because ccp is weird)
            endp = root + str(tourn) + '/series/{0}/matches/'.format(series)
            save(endp, json.loads(sess.get(endp).text), saveDir='tournaments/{0}/series/{1}/matches/'.format(tourn, series))
    # members
    # bans taken from teams


if __name__ == '__main__':
    main()
