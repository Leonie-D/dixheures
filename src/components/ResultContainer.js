import React from 'react';
import ResultItem from "./ResultItem";
import {getDetailledFromRecording, getDetailledFromArtist, getDetailledFromRelease} from "../api/musicAPI";

class ResultContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "result" : [],
            "isLoaded" : false,
            "responsesNb" : 0,
        }
        this.intIds = [];
    }

    sendRequest = (offset) => {
        const {query, queryField, token, continuer} = this.props;
        switch(queryField) {
            case 'artist' :
                getDetailledFromArtist(query.value, offset, this.updateResults, this.getNextResults, token, continuer);
                break;
            case 'release' :
                getDetailledFromRelease(query, offset, this.updateResults, this.getNextResults, token, continuer);
                break;
            case 'recording' :
                getDetailledFromRecording(query.label, offset, this.updateResults, this.getNextResults, token, continuer);
                break;
        };
    }

    updateResults = (newTitle, responsesNb, token) => {
        // ne pas intégrer un résultat tardif
        if(token === this.props.token) {
            const result = [...this.state.result, newTitle];
            this.setState({
                "result" : result,
                "isLoaded" : true,
                "responsesNb" : responsesNb,
            });
        }
    }

    getNextResults = (responsesNb, offset) => {
        if(offset+100 < responsesNb) {
            const intId = setTimeout(() => {
                offset += 100;
                this.sendRequest(offset);
            }, 100000);
            this.intIds = [...this.intIds, intId];
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.token !== prevProps.token) {
            for(let intId of this.intIds) {
                clearTimeout(intId);
            }
            this.intIds = [];
            this.setState({
                "result" : [],
            })
            this.sendRequest(0);
        }
    }

    render(){
        const {result, isLoaded, responsesNb} = this.state;
        let resultContainer;
        if(this.props.token === "") {
            resultContainer = <p>Que puis-je faire pour toi ?</p>
        } else {
            if(isLoaded) {
                if(result.length > 0) {
                    resultContainer =
                        <div>
                            <div className="table-header">
                                <h2>Voici tout ce que j'ai trouvé</h2>
                                <p>{"- " + result.length + (result.length > 1 ?  " résultats" : " résultat") + "/" + responsesNb}</p>
                            </div>
                            <table className="resultats">
                                <thead>
                                <tr>
                                    <th>N°</th>
                                    <th>Titre</th>
                                    <th>Artiste(s)</th>
                                    <th>Album(s)</th>
                                    <th>En savoir plus</th>
                                </tr>
                                </thead>
                                <tbody>
                                {result.map((r, index) => <ResultItem key={index} id={r.id} rang={index + 1} titre={r.titre} artistes={r.artistes} albums={r.albums} openModal={this.props.openModal} genres={r.genres} rating={r.rating} duree={r.duree} />)}
                                </tbody>
                            </table>
                        </div>
                } else {
                    resultContainer = <p>Aucun résultat</p>
                }
            } else {
                resultContainer = <p>Chargement...</p>
            }
        }

        return(
            <div className="resultContainer">
                {resultContainer}
            </div>
        );
    }
}

export default ResultContainer;