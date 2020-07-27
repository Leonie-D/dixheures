import React from 'react';
import './App.css';
import SearchForm from "./components/SearchForm";
import ResultContainer from "./components/ResultContainer";
import Header from "./components/Header";
import Footer from "./components/Footer";

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Header />
                <main>
                    <SearchForm />
                    <ResultContainer />
                </main>
                <Footer />
            </div>
        );
    }
}

export default App;
