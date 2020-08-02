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
            "queryId" : ""
        }
    }

    updateResultContainer = (queryId) => {
        if(queryId !== "") {
            this.setState({
                "queryId" : queryId
            });
        } else {
            this.setState({
                "queryId" : ""
            });
        }
    }

    render() {
        const {queryId} = this.state;

        return (
            <div className="App">
                <Header />
                <main>
                    <SearchForm updateResultContainer={this.updateResultContainer} />
                    {queryId === "" ? <p>Que puis-je faire pour toi ?</p> : <ResultContainer queryId={queryId} />}
                </main>
                <Footer />
            </div>
        );
    }
}

export default App;
