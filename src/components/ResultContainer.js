import React from 'react';
import ResultItem from "./ResultItem";
import {getTitlesResult} from "../api/musicAPI";

class ResultContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "results" : [],
            "isLoaded" : false,
        }
    }

    updateResults = (results) => {
        this.setState({
            "results" : results,
            "isLoaded" : true,
        });
    }

    componentDidMount() {
        getTitlesResult(this.props.query, this.props.queryField, 0, this.updateResults);
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