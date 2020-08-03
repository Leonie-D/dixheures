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

export const getTitlesResult = (query, queryField, offset, updateResult) => {
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

    if(queryField === "recording") {
        request.open("GET", "https://musicbrainz.org/ws/2/" + queryField + "/?query=" + queryField + ":" + query + "*&fmt=json&limit=100&offset=" + offset, true);
    } else {
        request.open("GET", "http://musicbrainz.org/ws/2/recording/?"+queryField+"="+query+"&fmt=json&limit=100&offset=" + offset, true);
    }
    request.send();
}
