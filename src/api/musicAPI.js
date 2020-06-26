export const getArtistsByName = (query, updateFunc) => {
    const request = new XMLHttpRequest();
    const escapedQuery = query.replace(/([\!\*\+\&\|\(\)\[\]\{\}\^\~\?\:\"])/g, "\\$1");

    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            const artistsList = JSON.parse(request.responseText).artists;
            updateFunc(artistsList);
        };
    });
    request.open("GET", "https://musicbrainz.org/ws/2/artist?query=artist:"+escapedQuery+"* OR artistaccent:"+escapedQuery+"* OR alias:"+escapedQuery+"*&fmt=json", true);
    request.send();
}