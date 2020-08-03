import React from 'react';
import './App.css';
import SearchForm from "./components/SearchForm";
import ResultContainer from "./components/ResultContainer";
import Header from "./components/Header";
import Footer from "./components/Footer";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "query" : "",
            "queryField" : "",
        }
    }

    updateResultContainer = (query, queryField) => {
        if(query !== "") {
            this.setState({
                "query" : query,
                "queryField" : queryField,
            });
        } else {
            this.setState({
                "query" : "",
                "queryField" : "",
            });
        }
    }

    render() {
        const {query, queryField} = this.state;

        return (
            <div className="App">
                <Header />
                <main>
                    <SearchForm updateResultContainer={this.updateResultContainer} />
                    {query === "" ? <p>Que puis-je faire pour toi ?</p> : <ResultContainer query={query} queryField={queryField} />}
                </main>
                <Footer />
            </div>
        );
    }
}

export default App;
