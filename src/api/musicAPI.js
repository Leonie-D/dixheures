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

            // formattage du résultat -> [{"id" : identifiant unique, "name" : nom de l'album...}]
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

            console.log(responsesNb);
            console.log(allTitles);

            // formattage du résultat -> [{"id" : identifiant unique, "name" : nom de l'album...}]
            const titlesList = [];
            //envoyer un requete supplémentaire pour récupérer l'album...
            /*for(let recording of allTitles) {
                const secondRequest = new XMLHttpRequest();
                secondRequest.addEventListener('readystatechange', function() {
                    if (secondRequest.readyState === XMLHttpRequest.DONE && secondRequest.status === 200) {
                        console.log(JSON.parse(request.responseText));
                    }
                });
                secondRequest.open("GET", "http://musicbrainz.org/ws/2/release/?recordings:"+recording.id+"&fmt=json", true);
                secondRequest.send();
            }*/
            }
        });

    request.open("GET", "http://musicbrainz.org/ws/2/recording/?artist="+query+"&fmt=json&limit=100&offset=" + offset, true);
    request.send();
}

export const getDetailledFromRelease = (query, offset, updateResult) => {
    //
}
