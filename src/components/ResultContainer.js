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

    sendRequest = (offset, callback) => {
        switch(this.props.queryField) {
            case 'artist' :
                getDetailledFromArtist(this.props.query, offset, this.updateResults);
                break;
            case 'release' :
                getDetailledFromRelease(this.props.query, offset, this.updateResults);
                break;
            case 'recording' :
                getDetailledFromRecording(this.props.query, offset, this.updateResults);
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
                this.sendRequest(offset, this.updateResults);
            }, 2000);
            this.intIds = [...this.intIds, intId];
        }
    }

    componentDidMount() {
        this.sendRequest(0, this.updateResults);
    }

    componentWillUnmount() {
        for(let intId of this.intIds) {
            clearTimeout(intId);
        }
    }

    render(){
        const {result, isLoaded} = this.state;

        return(
            <div>
                {isLoaded ?
                    <div>
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
                           {result.map((r, index) => <ResultItem key={index} id={r.id} titre={r.titre} artiste={r.artiste} album={r.album} />)}
                        </tbody>
                    </div>
                    :
                    <p>Chargement...</p>
                }
            </div>
        );
    }
}

export default ResultContainer;