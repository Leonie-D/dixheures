export const getSearchByName = (query, queryField, offset, updateResult) => {
    const request = new XMLHttpRequest();
    query = query.replace("#", "");
    query = query.replace(/([\!\*\+\&\|\(\)\[\]\{\}\^\~\?\:\"])/g, "\\$1");
    const resultList = [];
    const key = queryField+"s";

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && (request.status === 200 || request.status === 304)) {
            const responsesNb = JSON.parse(request.responseText).count;
            const allResults = JSON.parse(request.responseText)[key];

            // formattage du résultat
            for(let result of allResults) {
                if(queryField === "artist") {
                    resultList.push({"value": result.name, "label": result.name});
                } else {
                    resultList.push({"value": result.title, "label": result.title});
                }
            };

            // affichage des résultats
            updateResult(resultList, responsesNb, offset, queryField);
        };
    });

    request.open("GET", "https://musicbrainz.org/ws/2/" + queryField + "/?query=" + queryField + ":" + query + "*&fmt=json&limit=100&offset=" + offset, true);
    request.send();
}

export const getAllRecordings = (query, queryField, offset, updateResult, getNextResults, token, continuer) => {
    const request = new XMLHttpRequest();
    query = query.replace("#", "");
    query = '"' + query.replace(/([\!\*\+\&\#\|\(\)\[\]\{\}\^\~\?\:\"])/g, "\\$1") + '"';
    const recordingsList = [];

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && (request.status === 200 || request.status === 304)) {
            const responsesNb = JSON.parse(request.responseText).count;
            const allRecordings = JSON.parse(request.responseText).recordings;

            // formattage du résultat
            for(let recording of allRecordings) {
                recordingsList.push(
                    {
                        "id": recording.id,
                        "titre": recording.title,
                        "artistes": typeof recording['artist-credit'] !== "undefined" ? recording['artist-credit'].map(x => x.name).join(', ') : "unknown artist",
                        "albums": (typeof recording.releases !== "undefined" && recording.releases.length > 0) ? recording.releases.map( x => [x.title, x.id]) : [["Unknown album", ""]],
                        "duree" : recording.length !== null ? recording.length : "-",
                    }
                );
            }
            updateResult(recordingsList, responsesNb, token);

            if(continuer(token)) {
                getNextResults(responsesNb, offset);
            }
        };
    });
    if(queryField === 'all') {
        request.open("GET", "https://musicbrainz.org/ws/2/recording/?query=artist:" + query + "ORrecording:" + query + "ORrelease:" + query + "&fmt=json&limit=100&offset=" + offset, true);
    } else {
        request.open("GET", "https://musicbrainz.org/ws/2/recording/?query=" + queryField + ":" + query + "&fmt=json&limit=100&offset=" + offset, true);
    }
    request.send();
}

export const getPictures = (albumId, displayPictures) => {
    const request = new XMLHttpRequest();

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && (request.status === 200 || request.status === 304)) {
            const images = JSON.parse(request.responseText).images.map(x => x.thumbnails.small);
            displayPictures(images);
        }
        if (request.readyState === XMLHttpRequest.DONE && request.status === 404) {
            displayPictures([]);
        }
    });

    request.open("GET", "http://coverartarchive.org/release/"+albumId, true);
    request.send();
}

export const getAdditionnalDetails = (recordingId, updateAdditionnalDetails) => {
    const request = new XMLHttpRequest();

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && (request.status === 200 || request.status === 304)) {
            const genres = JSON.parse(request.responseText).genres;
            const rating = JSON.parse(request.responseText).rating;

            updateAdditionnalDetails(rating, genres);
        }
    });

    request.open("GET", "http://musicbrainz.org/ws/2/recording/" + recordingId + "?inc=genres+ratings&fmt=json", true);
    request.send();
}
