import React from 'react';
import ResultItem from "./ResultItem";
import {getTitlesByQueryId} from "../api/musicAPI";

class ResultContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "results" : [],
            "isLoaded" : false,
        }
    }

    updateResults = (results) => {
        console.log('ici');
        this.setState({
            "results" : results,
            "isLoaded" : true,
        });
    }

    componentDidMount() {
        console.log(this.props.queryId);
        console.log(this.state.isLoaded);
        getTitlesByQueryId(this.props.queryId, 0, this.updateResults);
    }

    render(){
        const {results, isLoaded} = this.state;

        return(
            <div>
                {isLoaded ?
                    <div>
                        <h2>Voici tout ce que j'ai trouvé</h2>
                        <ul>
                            {results.map(r => <ResultItem />)}
                        </ul>
                    </div>
                    :
                    <p>Chargement...</p>
                }
            </div>
        );
    }
}

export default ResultContainer;