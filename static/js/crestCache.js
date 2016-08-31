/*
 * Proof of concept CREST API queried and cached in browser
*/
var max = 150;
var rateLimit = 0; // max 150
/*
 * not cached or expired cache, get data
 * every 150 requests we forcefully stop as CREST is rate-limited to 150/sec
 * so this works for a really simple client-side control of that
*/
function queryCrest(crestURL) {
    rateLimit +=1;
    if (rateLimit < max) {
        return $.ajax({
            type: "GET",
            url: crestURL
        });
    }
    else {
        console.log('[!!] hit preventative rateLimit, wait 1, requery');
        rateLimit = 0;
        $('#rl').empty();
        $('#rl').append('<div class="ui compact negative message"><i class="warning sign icon"></i> rate limit, please reselect tournament</div>');
    }
}


/*
 * determine if browser supports localStorage
 * then determine if the data is already cached
 * returns data if cached or null if not cached yet
 * returns null if expired
*/
function getCached(queryStr) {
    var data = null;
    if (typeof(Storage) !== "undefined") {
        // if you have stored it before, check if expired
        // otherwise already null
        if (localStorage.getItem(queryStr) !== null) {
            data = JSON.parse(localStorage.getItem(queryStr));
            // if data hasn't expired yet return it
            var now = new Date().getTime();
            if (now < data.cached_until) {
                return data;
            }
            // otherwise don't return it
            else {
                data = null;
            }
        }
    }
    else {
        console.log("[!!] localStorage unsupported");
    }
    return data;
}


/*
 * data is cached for 5 minutes if no parameter passed
 * TODO -- parse cache-control header for offset
*/
function cache(data, queryStr, cacheOffset) {
    var offset = cacheOffset;
    var cacheDuration = new Date().getTime(); // now
    if (offset === undefined) {
        offset = 300000;
    }
    cacheDuration = cacheDuration + offset;
    var cacheMe = {};
    cacheMe[queryStr] = data;
    // cache for 5 minutes (30000 ms)
    cacheMe['cached_until'] = cacheDuration;
    // stringify the object so getItem returns the object
    localStorage.setItem(queryStr, JSON.stringify(cacheMe));
}


/*
 * Take in a url to query/cache check for
 * Take in a function to parse that response
 *
*/
function retrieveAndParse(url, parseFunc, optArgs) {
    var opt = arguments.length;
    var key = url.replace("https://crest-tq.eveonline.com","");
    // check if data is already cached
    var cachedData = getCached(key);
    // expired or not cached, get new data, cache, parse
    if (cachedData === null) {
        cachedData = queryCrest(url);
        cachedData.success(function(resp) {
            // add in the original url as matches of a bye series
            //  have no way of knowing which series they are associated with, team still doesn't have series <id>
            resp['query_url'] = url;
            cache(resp, key);
            // teams need associated series <id>
            switch (opt) {
                case 3: parseFunc(resp, optArgs);break;
                default: parseFunc(resp);break;
            }
        }); // every CREST call is successful, ccp returns json error message
        cachedData.error(function(resp, err) {
            console.log('[!!] error in retrieving new data:');
            console.log('[!!] attempted: ' + url);
            console.log(resp);
            console.log(err);
        });
    }
    // already cached
    else {
        switch (opt) {
            case 3: parseFunc(cachedData[key], optArgs);break;
            default: parseFunc(cachedData[key]);break;
        }
    }
}