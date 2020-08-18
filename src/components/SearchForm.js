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
            "menuIsOpen" : false,
        };
        this.queryId = "";
        this.intIds = [];
        this.focusOnSelect = false;
    }

    sendRequest = (queryField, query, offset) => {
        if(query !== "") {
            switch(queryField) {
                case 'all' :
                    getSearchByName(query, 'artist', offset, this.updateResult);
                    getSearchByName(query, 'release', offset, this.updateResult);
                    getSearchByName(query, 'recording', offset, this.updateResult);
                    break;
                case 'artist' :
                case 'release' :
                case 'recording' :
                    getSearchByName(query, queryField, offset, this.updateResult);
                    break;
            };
        }
    }

    clearPreviousTimeOut = () => {
        for(let intId of this.intIds) {
            clearTimeout(intId);
        }
        this.intIds = [];
    }

    updateQuery = (query, action) => {
        if(action.action === "input-change"){
            const {queryField} = this.state;

            this.setState({
                "query" : query,
                "result" : [],
                "menuIsOpen" : true,
            });

            // annuler les requetes liées à l'ancienne valeur de l'input
            this.clearPreviousTimeOut();

            // si champ non vide, envoyer la première requete pour mettre à jour en temps réel le menu déroulant
            if(query !== "") {
                this.sendRequest(queryField, query, 0);
            }
        }
    }

    updateFinalQuery = (query, action) => {
        this.setState({
            "query" : query !== null ? query : "",
            "menuIsOpen" : false,
        });
        this.queryId = query !== null ? query.value : "";

        // annuler les requetes liées à l'ancienne valeur de l'input
        this.clearPreviousTimeOut();

        // si champ vidé, l'indiquer dans resultContainer
        if(action.action === "clear") {
            this.props.updateResultContainer(this.queryId, this.state.queryField);
        }

        // indiquer si focus lié à la sélection ou non (pour removeFinalQuery)
        this.focusOnSelect = true;
    }

    removeFinalQuery = () => {
        if(this.focusOnSelect) {
            // réinitialisation de la variable
            this.focusOnSelect = false;
        } else {
            this.setState({
                "query" : "",
                "result" : [],
                "menuIsOpen" : true,
            });

            // annuler les requetes liées à l'ancienne valeur de l'input
            this.clearPreviousTimeOut();

            // Indiquer dans resultContainer qu'aucune recherche n'est en cours
            this.queryId = "";
            this.props.updateResultContainer(this.queryId, this.state.queryField);
        }
    }

    blur = () => {
        this.setState({
            "menuIsOpen" : false
        });
    }

    updateField = (queryField) => {
        const query = typeof this.state.query === "string" ? this.state.query : this.state.query.label;

        this.setState({
            "queryField" : queryField.value,
            "result" : [],
            "menuIsOpen" : true,
        });

        // annuler les requetes liées à l'ancienne valeur de l'input
        this.clearPreviousTimeOut();

        // envoyer la première requete pour mettre à jour en temps réel le menu déroulant
        this.sendRequest(queryField.value, query, 0);
    }

    updateResult = (result, responsesNb, offset, actualQueryField) => {
        const {query, queryField} = this.state;

        if(queryField === 'all') {
            result = result.map(obj => {
                const rObj = {"value" : obj.value, "label" : obj.label + " [" + actualQueryField + "]", "type" : actualQueryField}; // préciser le champ concerné par la réponse
                return rObj;
            });
        }

        result = [...this.state.result, ...result];
        this.setState({
            "result" : result
        });

        if(typeof query == "string") {
            if(offset+100 < responsesNb){
                const intId = setTimeout(() => {
                    offset += 100;
                    getSearchByName(query, actualQueryField, offset, this.updateResult);
                }, 2000); // génère quand même des erreurs 503... Va même jusqu'à perturber le submit...
                this.intIds = [...this.intIds, intId];
            }
        }
    }

    submit = (ev) => {
        ev.preventDefault();

        this.setState({
            "menuIsOpen" : false,
        });

        // stopper les requêtes précédentes visant à compléter le menu déroulant
        this.clearPreviousTimeOut();

        // stopper les requêtes précédentes visant à compléter le resultContainer
        this.props.generateNewToken();

        const {query, queryField} = this.state;
        if(queryField === 'all') {
            this.props.updateResultContainer(query, query.type);
        } else {
            this.props.updateResultContainer(query, queryField);
        }
    }

    render() {
        // Select dropdown options
        const selectOptions = [
                {value : 'all' , label : 'Tous les champs'},
                {value : 'artist' , label : 'Artiste'},
                {value : 'recording' , label : 'Titre'},
                {value :'release' , label : 'Album'}
        ];

        const {query, result, queryField, menuIsOpen} = this.state;

        return(
            <form onSubmit={this.submit}>

                <Select name = "query"
                        onInputChange = {this.updateQuery}
                        onChange = {this.updateFinalQuery}
                        onFocus = {this.removeFinalQuery}
                        onBlur = {this.blur}
                        options = {result}
                        menuIsOpen = {menuIsOpen}
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