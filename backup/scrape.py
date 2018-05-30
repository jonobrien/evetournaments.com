#!/usr/bin/python3

import requests
import json
import os


"""
 Quick and dirty rip of the public data used by evetournaments.com
 because the CREST API was removed, and this should allow the site
 to maintain the existing features.

 version 2, fixed file structure by properly checking paths with filename

"""


MAX_TOURNAMENTS = 17  # 1-16
MAX_TEAMS = 357  # 356 + 1 check manually online for it /teams/ 'totalCount_str'
ROOT = 'https://crest-tq.eveonline.com/'
TOURNAMENT_ROOT = 'https://crest-tq.eveonline.com/tournaments/'




def save(endpoint, jsonStr, stripStr=ROOT, saveDir=None):
    """
    generic saving method to check for file existing on fs
    and dump the json
    """
    shortened = endpoint.replace(stripStr, '')
    name = shortened[:-1] + '.json'

    if os.path.isfile(name):
        print('[!!] already have: {0}'.format(name))
        return
    name = shortened[:-1] + '.json'

    # tournament root returns dirname ''
    if not os.path.exists(os.path.dirname(name)) and os.path.dirname(name):
        os.makedirs(os.path.dirname(name), exist_ok=True)

    with open(name, 'w') as fd:
        json.dump(jsonStr, fd)
    print('[I] saved: {0}'.format(name))


def main():
    """
    make session, add user-agent, rip everything utilized in the app
    to be zipped and used after may 8, 2018
    """
    sess = requests.Session()
    root = TOURNAMENT_ROOT
    sess.headers.update({'User-Agent': 'evetournaments.com/scrape.py'})
    rootInfo = json.loads(sess.get(root).text)
    save(root, rootInfo)
    # for tournaments 1-5 you have to hard-code the <#>/series/
    # as the root endpoint for that tournament returns an error
    # but get them all anyway

    # teams returns ship and character images
    # teams has members and ban info
    # image urls use http not https

    # series has match winners, so skip /series/idX/
    # and just get /series/idX/matches/ as noted in my dev doc contribution


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




if __name__ == '__main__':
    main()
