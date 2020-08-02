export const getArtistsByName = (query, offset, updateResult) => {
    const request = new XMLHttpRequest();
    query = query.replace(/([\!\*\+\&\|\(\)\[\]\{\}\^\~\?\:\"])/g, "\\$1");
    const artistsList = [];

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) { // et statut 304 ?
            const responsesNb = JSON.parse(request.responseText).count;
            const allArtists = JSON.parse(request.responseText).artists;

            // formattage du résultat -> [{"id" : identifiant unique, "name" : nom de l'artiste/groupe...}]
            for(let artist of allArtists) {
                artistsList.push({"value": artist.id, "label": artist.name});
            };

            updateResult(artistsList, responsesNb, offset); // récupère les résultats des requetes envoyées avant le changement de query...
        };
    });

    request.open("GET", "https://musicbrainz.org/ws/2/artist/?query=artist:" + query + "*&fmt=json&limit=100&offset=" + offset, true);
    request.send();
}

export const getTitlesByName = (query, offset, updateResult) => {
    const request = new XMLHttpRequest();
    query = query.replace(/([\!\*\+\&\|\(\)\[\]\{\}\^\~\?\:\"])/g, "\\$1");

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            const responsesNb = JSON.parse(request.responseText).count;
            const allRecordings = JSON.parse(request.responseText).recordings;

            // formattage du résultat -> [{"id" : identifiant unique, "name" : nom du morceau...}]
            const titlesList = [];
            for(let recording of allRecordings) {
                titlesList.push({"value": recording.id, "label": recording.title});
            };

            updateResult(titlesList, responsesNb, offset);
        };
    });
    request.open("GET", "https://musicbrainz.org/ws/2/recording/?query=recording:"+query+"*&fmt=json&limit=100&offset=" + offset, true);
    request.send();
}

export const getReleasesByName = (query, offset, updateResult) => {
    const request = new XMLHttpRequest();
    query = query.replace(/([\!\*\+\&\|\(\)\[\]\{\}\^\~\?\:\"])/g, "\\$1");

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            const responsesNb = JSON.parse(request.responseText).count;
            const allReleases = JSON.parse(request.responseText).releases;

            // formattage du résultat -> [{"id" : identifiant unique, "name" : nom de l'album...}]
            const albumsList = [];
            for(let album of allReleases) {
                albumsList.push({"value": album.id, "label": album.title});
            };

            updateResult(albumsList, responsesNb, offset);
        };
    });
    request.open("GET", "http://musicbrainz.org/ws/2/release/?query=release:"+query+"*&fmt=json&limit=100&offset=" + offset, true);
    request.send();
}

export const getAllByName = (query, offset, updateResult) => {

}

export const getTitlesByQueryId = (queryId, queryField, offset, updateResult) => {
    const request = new XMLHttpRequest();

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            const responsesNb = JSON.parse(request.responseText).count;
            const allTitles = JSON.parse(request.responseText).recordings;

            // formattage du résultat -> [{"id" : identifiant unique, "name" : nom de l'album...}]
            const titlesList = [];
            for(let recording of allTitles) {
                titlesList.push({"id": recording.id, "name": recording.title});
            };

            updateResult(titlesList, responsesNb, offset);
        };
    });
    request.open("GET", "http://musicbrainz.org/ws/2/recording/?"+queryField+"="+queryId+"&fmt=json&limit=100&offset=" + offset, true);
    request.send();
}
