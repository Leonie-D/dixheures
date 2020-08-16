export const getSearchByName = (query, queryField, offset, updateResult) => {
    const request = new XMLHttpRequest();
    query = query.replace(/([\!\*\+\&\|\(\)\[\]\{\}\^\~\?\:\"])/g, "\\$1");
    const resultList = [];
    const key = queryField+"s";

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && (request.status === 200 || request.status === 304)) {
            const responsesNb = JSON.parse(request.responseText).count;
            const allResults = JSON.parse(request.responseText)[key];

            // formattage du résultat -> [{"id" : identifiant unique, "name" : nom de l'artiste/titre/album...}]
            for(let result of allResults) {
                if(queryField === "artist") {
                    resultList.push({"value": result.id, "label": result.name});
                } else {
                    resultList.push({"value": result.id, "label": result.title});
                }
            };

            updateResult(resultList, responsesNb, offset); // récupère les résultats des requetes envoyées avant le changement de query...
        };
    });

    request.open("GET", "https://musicbrainz.org/ws/2/" + queryField + "/?query=" + queryField + ":" + query + "*&fmt=json&limit=100&offset=" + offset, true);
    request.send();
}

export const getAllByName = (query, offset, updateResult) => {

}

export const getDetailledFromRecording = (query, offset, updateResult, getNextResults) => {
    const request = new XMLHttpRequest();

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && (request.status === 200 || request.status === 304)) {
            const responsesNb = JSON.parse(request.responseText).count;
            const allTitles = JSON.parse(request.responseText).recordings;

            // formattage du résultat
            for(let [i, recording] of allTitles.entries()) {
                const intId = setTimeout(() => {
                    const albums = typeof recording.releases !== "undefined" ? recording.releases.map(x => [x.title, x.id]) : ["unknown album"];

                    const secondRequest = new XMLHttpRequest();
                    secondRequest.addEventListener('readystatechange', function () {
                        if (secondRequest.readyState === XMLHttpRequest.DONE && (secondRequest.status === 200 || secondRequest.status === 304)) {
                            const response = JSON.parse(secondRequest.responseText);
                            const genres = response.genres.length > 0 ? response.genres.map(x => x.name).join(', ') : '-';
                            const rating = response.rating['votes-count'] > 0 ? response.rating.value : '-';

                            const titlesList = [];
                            for (let album of albums) {
                                titlesList.push({
                                    "id": recording.id,
                                    "titre": recording.title,
                                    "artiste": recording['artist-credit'][0].name,
                                    "album": album[0],
                                    "albumId" : album[1],
                                    "rating" : rating,
                                    "genres" : genres,
                                    "duree" : response.length !== null ? response.length : "-",
                                });
                            }

                            updateResult(titlesList);
                            clearTimeout(intId);
                        }
                    });
                    secondRequest.open("GET", "https://musicbrainz.org/ws/2/recording/" + recording.id + "/?&inc=genres+ratings&fmt=json&limit=100&offset=" + offset, true);
                    secondRequest.send();
                }, i * 1000);
            }

            getNextResults(responsesNb, offset);
        };
    });

    request.open("GET", "https://musicbrainz.org/ws/2/recording/?query=recording:" + query + "*&fmt=json&limit=100&offset=" + offset, true);
    request.send();
}

export const getDetailledFromArtist = (query, offset, updateResult, getNextResults) => {
    const request = new XMLHttpRequest();

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && (request.status === 200 || request.status === 304)) {
            const responsesNb = JSON.parse(request.responseText)['recording-count'];
            const allTitles = JSON.parse(request.responseText).recordings;

            // formattage du résultat
            for(let [i, recording] of allTitles.entries()) {
                const intId = setTimeout(() => {
                    const artists = typeof recording['artist-credit'] !== "undefined" ? recording['artist-credit'].map(x => x.name).join(', ') : "unknown artist";
                    const rating = recording.rating['votes-count'] > 0 ? recording.rating.value : '-';
                    const genres = recording.genres.length > 0 ? recording.genres.map(x => x.name).join(', ') : '-';

                    //envoyer un requete supplémentaire pour récupérer les albums...
                    // idéalement, il faudrait améliorer pour le cas où le nombre d'albums > 100...
                    const secondRequest = new XMLHttpRequest();
                    secondRequest.addEventListener('readystatechange', function() {
                        if (secondRequest.readyState === XMLHttpRequest.DONE && (secondRequest.status === 200 || secondRequest.status === 304)) {
                            const allReleases = JSON.parse(secondRequest.responseText);
                            const albums = typeof allReleases.releases !== "undefined" ? allReleases.releases.map( x => [x.title, x.id]) : ["unknown album"];

                            const titlesList = [];
                            for(let album of albums) {
                                titlesList.push({
                                    "id": recording.id,
                                    "titre": recording.title,
                                    "artiste" : artists,
                                    "album" : album[0],
                                    "albumId" : album[1],
                                    "genres" : genres,
                                    "rating" : rating,
                                    "duree" : recording.length !== null ? recording.length : "-",
                                });
                            }

                            updateResult(titlesList);
                            clearTimeout(intId);
                        }
                    });

                    secondRequest.open("GET", "http://musicbrainz.org/ws/2/release?recording=" + recording.id + "&fmt=json", true);
                    secondRequest.send();
                }, i * 1000);
            }
            getNextResults(responsesNb, offset);
        }
    });

    request.open("GET", "http://musicbrainz.org/ws/2/recording/?artist="+query+"&inc=ratings+genres+artist-credits&fmt=json&limit=100&offset=" + offset, true);
    request.send();
}

export const getDetailledFromRelease = (query, offset, updateResult, getNextResults) => {
    const request = new XMLHttpRequest();

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && (request.status === 200 || request.status === 304)) {
            const responsesNb = JSON.parse(request.responseText)['recording-count'];
            const allTitles = JSON.parse(request.responseText).recordings;

            // formattage du résultat
            const titlesList = [];
            for(let recording of allTitles) {
                const artists = typeof recording['artist-credit'] !== "undefined" ? recording['artist-credit'].map(x => x.name).join(', ') : "unknown artist";
                const rating = recording.rating['votes-count'] > 0 ? recording.rating.value : '-';
                const genres = recording.genres.length > 0 ? recording.genres.map(x => x.name).join(', ') : '-';
                titlesList.push({
                    "id": recording.id,
                    "titre": recording.title,
                    "artiste" : artists,
                    "album" : query.label,
                    "albumId" : query.value,
                    "genres" : genres,
                    "rating" : rating,
                    "duree" : recording.length !== null ? recording.length : "-",
                });
            };
            console.log(titlesList);
            updateResult(titlesList);
            getNextResults(responsesNb, offset);
        }
    });

    request.open("GET", "http://musicbrainz.org/ws/2/recording/?release="+query.value+"&fmt=json&inc=ratings+genres+artist-credits&limit=100&offset=" + offset, true);
    request.send();
}

export const getPictures = (albumId, displayPictures) => {
    const request = new XMLHttpRequest();

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && (request.status === 200 || request.status === 304)) {
            const images = JSON.parse(request.responseText).images.map(x => x.image);
            displayPictures(images);
        }
        if (request.readyState === XMLHttpRequest.DONE && request.status === 404) {
            displayPictures([]);
        }
    });

    request.open("GET", "http://coverartarchive.org/release/"+albumId, true);
    request.send();
}
