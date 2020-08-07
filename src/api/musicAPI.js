export const getSearchByName = (query, queryField, offset, updateResult) => {
    const request = new XMLHttpRequest();
    query = query.replace(/([\!\*\+\&\|\(\)\[\]\{\}\^\~\?\:\"])/g, "\\$1");
    const resultList = [];
    const key = queryField+"s";

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) { // et statut 304 ?
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

export const getDetailledFromRecording = (query, offset, updateResult) => {
    const request = new XMLHttpRequest();

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            const responsesNb = JSON.parse(request.responseText).count;
            const allTitles = JSON.parse(request.responseText).recordings;

            // formattage du résultat
            const titlesList = [];
            for(let recording of allTitles) {
                const albums = typeof recording.releases !== "undefined" ? recording.releases.map( x=> x.title) : ["unknown album"];
                for(let album of albums) {
                    titlesList.push({"id": recording.id, "titre": recording.title, "artiste" : recording['artist-credit'][0].name, "album" : album});
                }
            };

            updateResult(titlesList, responsesNb, offset);
        };
    });

    request.open("GET", "https://musicbrainz.org/ws/2/recording/?query=recording:" + query + "*&fmt=json&limit=100&offset=" + offset, true);
    request.send();
}

export const getDetailledFromArtist = (query, offset, updateResult) => {
    const request = new XMLHttpRequest();

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            const responsesNb = JSON.parse(request.responseText)['recording-count'];
            const allTitles = JSON.parse(request.responseText).recordings;

            // formattage du résultat
            const titlesList = [];
            for(let [i, recording] of allTitles.entries()) {
                const intId = setTimeout(() => {
                    const artists = typeof recording['artist-credit'] !== "undefined" ? recording['artist-credit'].map(x => x.name).join(', ') : "unknown artist";

                    //envoyer un requete supplémentaire pour récupérer les albums...
                    // idéalement, il faudrait améliorer pour le cas où le nombre d'albums > 100...
                    const secondRequest = new XMLHttpRequest();
                    secondRequest.addEventListener('readystatechange', function() {
                        if (secondRequest.readyState === XMLHttpRequest.DONE && secondRequest.status === 200) {
                            const allReleases = JSON.parse(secondRequest.responseText);
                            const albums = typeof allReleases.releases !== "undefined" ? allReleases.releases.map( x=> x.title) : ["unknown album"];
                            for(let album of albums) {
                                titlesList.push({"id": recording.id, "titre": recording.title, "artiste" : artists, "album" : album});
                            }

                            updateResult(titlesList, responsesNb, offset);
                        }
                    });

                    secondRequest.open("GET", "http://musicbrainz.org/ws/2/release?recording=" + recording.id + "&fmt=json", true);
                    secondRequest.send();
                }, i * 2000);
            }
        }
    });

    request.open("GET", "http://musicbrainz.org/ws/2/recording/?artist="+query+"&inc=artist-credits&fmt=json&limit=100&offset=" + offset, true);
    request.send();
}

export const getDetailledFromRelease = (query, offset, updateResult) => {
    const request = new XMLHttpRequest();

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            const responsesNb = JSON.parse(request.responseText)['recording-count'];
            const allTitles = JSON.parse(request.responseText).recordings;

            // formattage du résultat
            const titlesList = [];
            for(let recording of allTitles) {
                const artists = typeof recording['artist-credit'] !== "undefined" ? recording['artist-credit'].map(x => x.name).join(', ') : "unknown artist";
                titlesList.push({"id": recording.id, "titre": recording.title, "artiste" : artists, "album" : query.label});
            };
            updateResult(titlesList, responsesNb, offset);
        }
    });

    request.open("GET", "http://musicbrainz.org/ws/2/recording/?release="+query.value+"&fmt=json&inc=artist-credits&limit=100&offset=" + offset, true);
    request.send();
}
