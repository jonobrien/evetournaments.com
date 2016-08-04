/*
 * Proof of concept CREST API queried and cached in browser
*/
var max = 150;
var rateLimit = 0; // max 150
/*
 * not cached or expired cache, get data
*/
function queryCrest(crestURL) {
    rateLimit +=1;
    if (rateLimit < max) {
        //console.log(rateLimit + ' new data: '+ crestURL);
        return $.ajax({
            type: "GET",
            url: crestURL
        });
    }
    else {
        console.log('hit rateLimit, wait 1');
        rateLimit = 0;
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
        if (localStorage.getItem(queryStr) !== null) {
            data = JSON.parse(localStorage.getItem(queryStr));
            // if data hasn't expired yet return it
            var now = new Date().getTime();
            if (now < data.cached_until) {
                //console.log('valid cached until: ' + new Date(data.cached_until));
                //console.log(data);
                return data;
            }
            // otherwise don't return it
            else {
                /*
                console.log('cached data expired, return null');
                console.log('cache_expires: ' + data.cached_until);
                console.log('          now: ' + now);
                console.log('         diff: ' + (now-data.cached_until));
                */
                data = null;
            }
        }
        // data is null anyway don't need else {}
    }
    else {
        console.log("localStorage unsupported");
    }
    return data;
}


/*
 * data is cached for 5 minutes if no parameter passed
 * actually need to parse cache-control header for offset
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
    console.log("cached until: " + cacheMe.cached_until);
}
