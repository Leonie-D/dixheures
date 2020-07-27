export const getArtistsByName = (query, offset, updateResult) => {
    const request = new XMLHttpRequest();
    const escapedQuery = query.replace(/([\!\*\+\&\|\(\)\[\]\{\}\^\~\?\:\"])/g, "\\$1");
    const artistsList = [];

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) { // et statut 304 ?
            const responsesNb = JSON.parse(request.responseText).count;
            const allArtists = JSON.parse(request.responseText).artists;

            // formattage du résultat -> [{"id" : identifiant unique, "name" : nom de l'artiste/groupe...}]
            for(let artist of allArtists) {
                artistsList.push({"id": artist.id, "name": artist.name});
            };

            updateResult(artistsList, responsesNb, offset); // récupère les résultats des requetes envoyées avant le changement de query...
        };
    });

    request.open("GET", "https://musicbrainz.org/ws/2/artist/?query=artist:" + escapedQuery + "* OR artistaccent:" + escapedQuery + "*&fmt=json&limit=100&offset=" + offset, true);
    request.send();

}

export const getTitlesByName = (query, offset, updateResult) => {
    const request = new XMLHttpRequest();
    const escapedQuery = query.replace(/([\!\*\+\&\|\(\)\[\]\{\}\^\~\?\:\"])/g, "\\$1");

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            const responsesNb = JSON.parse(request.responseText).count;
            const allRecordings = JSON.parse(request.responseText).recordings;

            // formattage du résultat -> [{"id" : identifiant unique, "name" : nom du morceau...}]
            const titlesList = [];
            for(let recording of allRecordings) {
                titlesList.push({"id": recording.id, "name": recording.title});
            };

            updateResult(titlesList, responsesNb, offset);
        };
    });
    request.open("GET", "https://musicbrainz.org/ws/2/recording/?query=recording:"+escapedQuery+"*&fmt=json&limit=100&offset=" + offset, true);
    request.send();
}

export const getReleasesByName = (query, offset, updateResult) => {
    const request = new XMLHttpRequest();
    const escapedQuery = query.replace(/([\!\*\+\&\|\(\)\[\]\{\}\^\~\?\:\"])/g, "\\$1");

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            const responsesNb = JSON.parse(request.responseText).count;
            const allReleases = JSON.parse(request.responseText).releases;

            // formattage du résultat -> [{"id" : identifiant unique, "name" : nom de l'album...}]
            const albumsList = [];
            for(let album of allReleases) {
                albumsList.push({"id": album.id, "name": album.title});
            };

            updateResult(albumsList, responsesNb, offset);
        };
    });
    request.open("GET", "http://musicbrainz.org/ws/2/release/?query=release:"+escapedQuery+"*&fmt=json&limit=100&offset=" + offset, true);
    request.send();
}

// revoir la logique de cette recherche... faire appel aux trois précédentes ?
export const getAllByName = (query, updateResult) => {
    const request = new XMLHttpRequest();
    const escapedQuery = query.replace(/([\!\*\+\&\|\(\)\[\]\{\}\^\~\?\:\"])/g, "\\$1");

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            const allResults = JSON.parse(request.responseText).recordings;

            //console.log(allResults);
            // formattage du résultat -> [{"id" : identifiant unique, "name" : }]
            const responsesList = [];
            /*for(let response of allResults) {
                responsesList.push({"id": response.id, "name": response.title + ' by ' + response['artist-credit'][0].name});
            };

            updateResult(responsesList);*/
        };
    });
    request.open("GET", "http://musicbrainz.org/ws/2/recording/?query=release:"+escapedQuery+"* OR artist:"+escapedQuery+"* OR alias:"+escapedQuery+"* OR artistaccent:"+escapedQuery+"* OR recording:"+escapedQuery+"*&fmt=json&limit=100", true);
    request.send();
}