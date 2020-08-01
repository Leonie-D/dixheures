import React from 'react';
import {getArtistsByName, getTitlesByName, getReleasesByName, getAllByName} from "../api/musicAPI";
import Select from 'react-select';

class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "query" : "",
            "queryField" : "all",
            "result" : [],
        };
        //this.queryToken = "";
        this.queryId = "";
        this.intIds = [];
    }

    updateQuery = (query) => {
        if(query !== "") {
            const {queryField} = this.state;

            this.setState({
                "query" : query,
                "result" : [],
            });

            //this.queryToken = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);

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
    }

    updateFinalQuery = (query) => {
        this.setState({
            "query" : query,
        });
        this.queryId = query.value;

        for(let intId of this.intIds) {
            clearTimeout(intId);
        }
        this.intIds = [];
    }

    updateField = (queryField) => {
        const query = typeof this.state.query === "string" ? this.state.query : this.state.query.label;

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
        // a voir si nécessaire de véfifier que les résultats qui arrivent sont bien attendus compte tenu de la recherche en cours ou s'il s'agit de résultats tardifs
        // idée : envoyer un 'token' pour la query en cours qui serait stocké ici en this.token et comparé à réception
        // abandonné étant donné que le Select de react-select ajoute une couche de 'filtre' et n'affiche que des choses pertinentes
        result = [...this.state.result, ...result];
        this.setState({
            "result" : result
        });

        const {query, queryField} = this.state;

        if(result.length < responsesNb && typeof query == "string") {
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

    submit = (ev) => {
        ev.preventDefault();
        console.log(this.queryId);
    }

    customFilterOption = (option, rawInput) => {
        const words = rawInput.split(' ');
        return words.reduce(
            (acc, cur) => acc && option.label.toLowerCase().includes(cur.toLowerCase()),
            true,
        );
    };

    render() {

        // Select dropdown options
        const selectOptions = [
                {value : 'all' , label : 'Tous les champs'},
                {value : 'artist' , label : 'Artiste'},
                {value : 'title' , label : 'Titre'},
                {value :'album' , label : 'Album'}
        ];

        const {query, result, queryField} = this.state;

        return(
            <form onSubmit={this.submit}>
               {/* https://github.com/JedWatson/react-select/issues/1351
                <input name="query"
                       type="text"
                       onChange={this.updateQuery}
                       value={query}
                       placeholder="Please enter an artist name, album title or song title"
                       list="resultOptions"
                />
                <datalist id="resultOptions" className="resultOptions">
                    {result.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </datalist>*/}

                <Select name = "query"
                        onInputChange = {this.updateQuery}
                        onChange = {this.updateFinalQuery}
                        options = {result}
                        value = {query}
                        placeholder = "Please enter an artist name, album title or song title"
                        isSearchable = {true}
                        isClearable = {true}
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
                        defaultValue = {selectOptions[0]}
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

            </form>
        );
    }
}

export default SearchForm;