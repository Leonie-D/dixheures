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
        this.nbSuccessRequests = 0;
        this.responsesNb = 0;
    }

    sendRequest = (queryField, query, offset, callback) => {
        switch(queryField) {
            case 'all' :
                // moyennement convaincue : les résultats vont potentiellement contenir 100 artistes puis 100 albums, etc..
                getArtistsByName(query, offset, callback);
                getReleasesByName(query, offset, callback);
                getTitlesByName(query, offset, callback);
                break;
            case 'artist' :
                getArtistsByName(query, offset, callback);
                break;
            case 'album' :
                getReleasesByName(query, offset, callback);
                break;
            case 'title' :
                getTitlesByName(query, offset, callback);
                break;
        };
    }

    updateQuery = (query, action) => {
        if(action.action === "input-change"){
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

            if(query !== "") {
                this.sendRequest(queryField, query, 0, this.updateResult);
            }
        }
    }

    updateFinalQuery = (query) => {
        this.setState({
            "query" : query !== null ? query : "",
        });
        this.queryId = query !== null ? query : "";

        for(let intId of this.intIds) {
            clearTimeout(intId);
        }
        this.intIds = [];
    }

    /*keepInputValue = (ev) => {
        if(ev.target.value === this.state.query) {
            this.setState({
                "query" : ev.target.value,
            });
        }
    }*/

    removeFinalQuery = (ev) => {
        if(ev.target.value !== this.state.query) {
            this.setState({
                "query" : "",
            });
        }
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

        this.sendRequest(queryField.value, query, 0, this.updateResult);
    }

    updateResult = (result, responsesNb, offset) => {
        // a voir si nécessaire de véfifier que les résultats qui arrivent sont bien attendus compte tenu de la recherche en cours ou s'il s'agit de résultats tardifs
        // idée : envoyer un 'token' pour la query en cours qui serait stocké ici en this.token et comparé à réception
        // abandonné étant donné que le Select de react-select ajoute une couche de 'filtre' et n'affiche que des choses pertinentes
        result = [...this.state.result, ...result];
        this.setState({
            "result" : result
        });

        this.nbSuccessRequests ++; //penser à reinitialiser au changement de requete

        const {query, queryField} = this.state;

        if(queryField === "all" && this.nbSuccessRequests <= 3) {
            this.responsesNb += responsesNb;
        } else if(queryField !== "all") {
            this.responsesNb = responsesNb;
        }
        // pb ici, les requetes sont envoyées plusieurs fois...
        if(result.length < this.responsesNb && typeof query == "string" && (queryField !== "all" || this.nbSuccessRequests % 3 !== 0)) {
            const intId = setTimeout(() => {
                offset += 100;
                this.sendRequest(queryField, query, offset, this.updateResult);
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

                <Select name = "query"
                        onInputChange = {this.updateQuery}
                        onChange = {this.updateFinalQuery}
                        //onBlur = {this.keepInputValue}
                        onFocus = {this.removeFinalQuery}
                        options = {result}
                        noOptionsMessage = {() => "Hum... je ne trouve aucun résultat"}
                        inputValue = {typeof query === "string" ? query : ''}
                        value = {query}
                        placeholder = "Saisis ta recherche"
                        isSearchable = {true}
                        isClearable = {true}
                        theme={theme => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary25: 'hsl(153,28%,90%)',
                                primary: '#4F6457',
                            },
                        })}/>

                <Select name = "queryField"
                        onChange = {this.updateField}
                        options = {selectOptions}
                        defaultValue = {selectOptions[0]}
                        value = {queryField.label}
                        isSearchable={false}
                        theme={theme => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary25: 'hsl(153, 28%, 90%)',
                                primary: '#4F6457',
                            },
                        })}/>

                <button>C'est parti</button>

            </form>
        );
    }
}

export default SearchForm;