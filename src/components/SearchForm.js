import React from 'react';
import {getArtistsByName, getTitlesByName, getReleasesByName, getAllByName} from "../api/musicAPI";
import Select from 'react-select';

class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "query" : {"value" : "", "label" : ""},
            "queryField" : "all",
            "result" : [],
            "selected" : false
        };
        this.queryId = "";
        this.intIds = [];
    }

    updateQuery = (query) => {
        const {queryField} = this.state;

        this.setState({
            "query" : query,
            "selected" : false,
            "result" : [],
        });
        this.queryId = query.value;

        for(let intId of this.intIds) {
            clearTimeout(intId);
        }
        this.intIds = [];

        switch(queryField) {
            case 'all' :
                getAllByName(query.label, 0, this.updateResult);
                break;
            case 'artist' :
                getArtistsByName(query.label, 0, this.updateResult);
                break;
            case 'album' :
                getReleasesByName(query.label, 0, this.updateResult);
                break;
            case 'title' :
                getTitlesByName(query.label, 0, this.updateResult);
                break;
        };
    }

    updateField = (queryField) => {
        const {query} = this.state;

        this.setState({
            "queryField" : queryField.value,
            "result" : [],
        });

        for(let intId of this.intIds) {
            clearTimeout(intId);
        }
        this.intIds = [];

        switch(queryField.value) {
            case 'all' :
                getAllByName(query.label, 0, this.updateResult);
                break;
            case 'artist' :
                getArtistsByName(query.label, 0, this.updateResult);
                break;
            case 'album' :
                getReleasesByName(query.label, 0, this.updateResult);
                break;
            case 'title' :
                getTitlesByName(query.label, 0, this.updateResult);
                break;
        };
    }

    updateResult = (result, responsesNb, offset) => {
        // a voir si nécessaire de véfifier que les résultats qui arrivent sont bien attendus compte tenu de la recherche en cours ou s'il s'agit de résultats tardifs
        // idée : envoyer un 'token' qui serait stocké ici en this.token
        // 1 token par query en cours
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
                        getAllByName(query.label, offset, this.updateResult);
                        break;
                    case 'artist' :
                        getArtistsByName(query.label, offset, this.updateResult);
                        break;
                    case 'album' :
                        getReleasesByName(query.label, offset, this.updateResult);
                        break;
                    case 'title' :
                        getTitlesByName(query.label, offset, this.updateResult);
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
/*
    fillInput = (ev) => {
        this.setState({
            "query" : ev.target.innerText,
            "selected" : true
        });
        this.queryId = ev.target.getAttribute('data-id');
    }*/

    submit = (ev) => {
        ev.preventDefault();
        console.log(this.queryId);
    }

    render() {

        // Select dropdown options
        const selectOptions = [
                {value : 'all' , label : 'Tous les champs'},
                {value : 'artist' , label : 'Artiste'},
                {value : 'title' , label : 'Titre'},
                {value :'album' , label : 'Album'}
        ];

        const {query, result, selected, queryField} = this.state;

        return(
            <form onSubmit={this.submit}>
                {/*<input name = "query"
                       onChange = {this.updateQuery}
                       value = {query}
                       placeholder = "Please enter an artist name, album title or song title"/>*/}

                <Select name = "query"
                        onChange = {this.updateQuery}
                        options = {result}
                        value = {query}
                        placeholder = "Please enter an artist name, album title or song title"
                        isClearable={true}
                        theme={theme => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary25: 'hsl(153, 28%, 90%)',
                                primary: '#4F6457',
                            },
                        })}/>

                <Select name = "queryField"
                        onChange = {this.updateField}
                        options = {selectOptions}
                        defaultValue={selectOptions[0]}
                        value = {queryField.label}
                        placeholder = "Please select research field"
                        isSearchable={false}
                        theme={theme => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary25: 'hsl(153, 28%, 90%)',
                                primary: '#4F6457',
                            },
                        })}/>

                <button>Rechercher</button>

                {/*{(result === null || query === "" || selected) ?
                    <ul className="hiddenOptions"> </ul>
                    :
                    <ul className="resultOptions">
                        {result.map((r, k) => <li key={k} data-id={r.id} onClick={this.fillInput}>{r.name}</li>)}
                    </ul>
                }*/}
            </form>
        );
    }
}

export default SearchForm;