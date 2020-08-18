import React from 'react';
import {getSearchByName} from "../api/musicAPI";
import Select from 'react-select';

class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "query" : "",
            "queryField" : "all",
            "result" : [],
        };
        this.queryId = "";
        this.intIds = [];
    }

    sendRequest = (queryField, query, offset) => {
        if(query !== "") {
            switch(queryField) {
                case 'all' :
                    getSearchByName(query, 'artist', offset, this.updateResultAll);
                    break;
                case 'artist' :
                case 'release' :
                case 'recording' :
                    getSearchByName(query, queryField, offset, this.updateResult);
                    break;
            };
        }
    }

    updateQuery = (query, action) => {
        if(action.action === "input-change"){
            const {queryField} = this.state;

            this.setState({
                "query" : query,
                "result" : [],
            });

            // annuler les requetes liées à l'ancienne valeur de l'input
            for(let intId of this.intIds) {
                clearTimeout(intId);
            }
            this.intIds = [];

            // si champ non vide, envoyer la première requete pour mettre à jour en temps réel le menu déroulant
            if(query !== "") {
                this.sendRequest(queryField, query, 0);
            }
        }
    }

    updateFinalQuery = (query, action) => {
        this.setState({
            "query" : query !== null ? query : "",
        });
        this.queryId = query !== null ? query.value : "";

        // annuler les requetes liées à l'ancienne valeur de l'input
        for(let intId of this.intIds) {
            clearTimeout(intId);
        }
        this.intIds = [];

        // si champ vidé, l'indiquer dans resultContainer
        if(action.action === "clear") {
            this.props.updateResultContainer(this.queryId, this.state.queryField);
        }
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
                "result" : [],
            });

            // annuler les requetes liées à l'ancienne valeur de l'input
            for(let intId of this.intIds) {
                clearTimeout(intId);
            }
            this.intIds = [];

            // Indiquer dans resultContainer qu'aucune recherche n'est en cours
            this.queryId = "";
            this.props.updateResultContainer(this.queryId, this.state.queryField);
        }
    }

    updateField = (queryField) => {
        const query = typeof this.state.query === "string" ? this.state.query : this.state.query.label;

        this.setState({
            "queryField" : queryField.value,
            "result" : [],
        });

        // annuler les requetes liées à l'ancienne valeur de l'input
        for(let intId of this.intIds) {
            clearTimeout(intId);
        }
        this.intIds = [];

        // envoyer la première requete pour mettre à jour en temps réel le menu déroulant
        this.sendRequest(queryField.value, query, 0);
    }

    updateResult = (result, responsesNb, offset) => {
        result = [...this.state.result, ...result];
        this.setState({
            "result" : result
        });

        const {query, queryField} = this.state;

        if(result.length < responsesNb && typeof query == "string") {
            const intId = setTimeout(() => {
                offset += 100;
                this.sendRequest(queryField, query, offset);
            }, 500);
            this.intIds = [...this.intIds, intId];
        }
    }

    updateResultAll = (result, responsesNb, offset, queryField) => {
        result = result.map(obj => {
            const rObj = {"value" : obj.value, "label" : obj.label + " [" + queryField + "]"}; // préciser le champ concerné par la réponse
            return rObj;
        });

        result = [...this.state.result, ...result];
        this.setState({
            "result" : result
        });

        const {query} = this.state;

        if(typeof query == "string") {
            if(offset+100 < responsesNb) {
                const intId = setTimeout(() => {
                    offset += 100;
                    this.sendRequest(queryField, query, offset);
                }, 500);
                this.intIds = [...this.intIds, intId];
            }
            switch(queryField){
                case 'artist' :
                    this.sendRequest('release', query, offset); // n'appelle pas la bonne méthode de mise à jour du résultat
                case 'release' :
                    this.sendRequest('recording', query, offset); // et en plus va potentiellement dépasser l'offset...
                case 'recording' :
                    this.sendRequest('artist', query, offset);
            }
        }
    }

    submit = (ev) => {
        ev.preventDefault();

        // stopper les requêtes précédentes visant à compléter le menu déroulant
        for(let intId of this.intIds) {
            clearTimeout(intId);
        }

        // stopper les requêtes précédentes visant à compléter le resultContainer
        this.props.generateNewToken();

        const {query, queryField} = this.state;
        this.props.updateResultContainer(query, queryField);
    }

    render() {
        // Select dropdown options
        const selectOptions = [
                {value : 'all' , label : 'Tous les champs'},
                {value : 'artist' , label : 'Artiste'},
                {value : 'recording' , label : 'Titre'},
                {value :'release' , label : 'Album'}
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