import React from 'react';
import {getArtistsByName, getTitlesByName, getReleasesByName, getAllByName} from "../api/musicAPI";

class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "query" : "",
            "queryField" : "all",
            "result" : [],
            "selected" : false
        };
        this.queryId = "";
        this.intIds = [];
    }

    updateQuery = (ev) => {
        const {queryField} = this.state;
        const query = ev.target.value;

        this.setState({
            "query" : query,
            "selected" : false,
            "result" : [],
        });

        for(let intId of this.intIds) {
            clearTimeout(intId);
        }
        this.intIds = [];

        switch(queryField) {
            case 'all' :
                getAllByName(query, 0, this.updateResult);
                break;
            case 'artist' :
                getArtistsByName(query, 0, this.updateResult);
                break;
            case 'album' :
                getReleasesByName(query, 0, this.updateResult);
                break;
            case 'title' :
                getTitlesByName(query, 0, this.updateResult);
                break;
        };
    }

    updateField = (ev) => {
        const {query} = this.state;
        const queryField = ev.target.value;

        this.setState({
            "queryField" : queryField,
            "result" : [],
        });

        for(let intId of this.intIds) {
            clearTimeout(intId);
        }
        this.intIds = [];

        switch(queryField) {
            case 'all' :
                getAllByName(query, 0, this.updateResult);
                break;
            case 'artist' :
                getArtistsByName(query, 0, this.updateResult);
                break;
            case 'album' :
                getReleasesByName(query, 0, this.updateResult);
                break;
            case 'title' :
                getTitlesByName(query, 0, this.updateResult);
                break;
        };
    }

    updateResult = (result, responsesNb, offset) => {
        result = [...this.state.result, ...result];
        this.setState({
            "result" : result
        });

        const {query, queryField} = this.state;

        if(result.length < responsesNb) {
            const intId = setTimeout(() => {
                offset += 100;
                switch(queryField) {
                    case 'all' :
                        getAllByName(query, offset, this.updateResult);
                        break;
                    case 'artist' :
                        getArtistsByName(query, offset, this.updateResult);
                        break;
                    case 'album' :
                        getReleasesByName(query, offset, this.updateResult);
                        break;
                    case 'title' :
                        getTitlesByName(query, offset, this.updateResult);
                        break;
                };
            }, 2000);
            this.intIds = [...this.intIds, intId];
        }
    }

    componentWillUnmount() {
        for(let intId of this.intIds) {
            clearTimeout(intId);
        }
    }

    fillInput = (ev) => {
        this.setState({
            "query" : ev.target.innerText,
            "selected" : true
        });
        this.queryId = ev.target.id;
    }

    submit = (ev) => {
        ev.preventDefault();
        console.log(this.queryId)
    }

    render() {

        // Select dropdown options
        const selectOptions = [
            ['all' , 'Tous les champs'],
            ['artist' , 'Artiste'],
            ['title' , 'Titre'],
            ['album' , 'Album']
        ];

        const {query, result, selected} = this.state;

        return(
            <form onSubmit={this.submit}>
                <input name="query"
                       onChange={this.updateQuery}
                       value={query}
                       placeholder="Please enter an artist name, album title or song title"
                ></input>
                <select onChange={this.updateField}>
                    {selectOptions.map(r => <option key={r[0]} value={r[0]}>{r[1]}</option>)}
                </select>
                <button>Rechercher</button>
                {(result === null || query === "" || selected) ?
                    <ul className="hiddenOptions"></ul>
                    :
                    <ul className="resultOptions">
                        {result.map(r => <li key={r.id} id={r.id} onClick={this.fillInput}>{r.name}</li>)}
                    </ul>
                }
            </form>
        );
    }
}

export default SearchForm;