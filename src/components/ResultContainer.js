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
                getDetailledFromArtist(query.value, offset, this.updateResults);
                break;
            case 'release' :
                getDetailledFromRelease(query, offset, this.updateResults);
                break;
            case 'recording' :
                getDetailledFromRecording(query.label, offset, this.updateResults);
                break;
        };
    }

    updateResults = (result, responsesNb, offset) => {
        result = [...this.state.result, ...result];
        this.setState({
            "result" : result,
            "isLoaded" : true,
        });

        console.log(result);

        if(result.length < responsesNb) {
            const intId = setTimeout(() => {
                offset += 100;
                this.sendRequest(offset);
            }, 2000);
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
    }

    render(){
        const {result, isLoaded} = this.state;

        return(
            <div className="resultContainer">
                {isLoaded ?
                    <div>
                        <p>{result.length > 1 ? result.length + " résultats" : result.length + " résultat"}</p>
                        <table>
                            <h2>Voici tout ce que j'ai trouvé</h2>
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
                               {result.map((r, index) => <ResultItem key={index} id={r.id} rang={index} titre={r.titre} artiste={r.artiste} album={r.album} openModal={this.props.openModal} genres={r.genres} rating={r.rating} />)}
                            </tbody>
                        </table>
                    </div>
                    :
                    <p>Chargement...</p>
                }
            </div>
        );
    }
}

export default ResultContainer;