import React from 'react';
import ResultItem from "./ResultItem";

class ResultContainer extends React.Component {
    render(){
        return(
            <div>
                <h2>tous les résultats ici</h2>
                <ResultItem />
                <ResultItem />
                <ResultItem />
            </div>
        );
    }
}

export default ResultContainer;