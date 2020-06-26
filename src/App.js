import React from 'react';
import './App.css';
import SearchForm from "./components/SearchForm";
import ResultContainer from "./components/ResultContainer";
import Header from "./components/Header";

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Header />
                <main>
                    <SearchForm />
                    <ResultContainer />
                </main>
            </div>
        );
    }
}

export default App;
