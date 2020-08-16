import React from 'react';
import ResultItem from "./ResultItem";
import {getDetailledFromRecording, getDetailledFromArtist, getDetailledFromRelease} from "../api/musicAPI";

class ResultContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "result" : [],
            "isLoaded" : false,
        }
        this.intIds = [];
    }

    sendRequest = (offset) => {
        const {query, queryField} = this.props;
        switch(queryField) {
            case 'artist' :
                getDetailledFromArtist(query.value, offset, this.updateResults, this.getNextResults);
                break;
            case 'release' :
                getDetailledFromRelease(query, offset, this.updateResults, this.getNextResults);
                break;
            case 'recording' :
                getDetailledFromRecording(query.label, offset, this.updateResults, this.getNextResults);
                break;
        };
    }

    updateResults = (result) => {
        result = [...this.state.result, ...result];
        this.setState({
            "result" : result,
            "isLoaded" : true,
        });
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

    componentDidMount() {
        this.sendRequest(0);
    }

    componentWillUnmount() {
        for(let intId of this.intIds) {
            clearTimeout(intId);
        }
        this.intIds = [];
    }

    render(){
        const {result, isLoaded} = this.state;

        return(
            <div className="resultContainer">
                {isLoaded ?
                    result.length > 0 ?
                        <div>
                            <div className="table-header">
                                <h2>Voici tout ce que j'ai trouvé</h2>
                                <p>{result.length > 1 ? "- " + result.length + " résultats" : "- " + result.length + " résultat"}</p>
                            </div>
                            <table className="resultats">
                                <thead>
                                    <tr>
                                        <th>N°</th>
                                        <th>Titre</th>
                                        <th>Artiste</th>
                                        <th>Album</th>
                                        <th>En savoir plus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                   {result.map((r, index) => <ResultItem key={index} id={r.id} rang={index} titre={r.titre} artiste={r.artiste} album={r.album} albumId={r.albumId} openModal={this.props.openModal} genres={r.genres} rating={r.rating} duree={r.duree} />)}
                                </tbody>
                            </table>
                        </div>
                        :
                        <p>Aucun résultat</p>
                    :
                    <p>Chargement...</p>
                }
            </div>
        );
    }
}

export default ResultContainer;