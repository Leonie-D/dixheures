import React from 'react';
import './App.css';
import SearchForm from "./components/SearchForm";
import ResultContainer from "./components/ResultContainer";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RecordingDetails from "./components/RecordingDetails";
import {getPictures} from "./api/musicAPI";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "query" : "",
            "queryField" : "",
            "modalIsOpen" : false,
            "images" : [],
            "imagesAreLoaded" : false,
        }
        this.id = "";
        this.titre = "";
        this.artistes = "";
        this.albums = "";
        this.rating = "";
        this.duree = "";
        this.queryToken = "";
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

    generateNewToken = () => {
        this.queryToken = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    }

    continuer = (token) => {
        return this.queryToken === token;
    }

    openModal = (id, titre, artistes, albums, duree) => {
        this.setState({
            "modalIsOpen" : true,
        });

        for(let [i, album] of albums.entries()) {
            const intId = setTimeout(() => {
                getPictures(album[1], this.displayPictures, intId);
            }, i*500);
        };

        this.id = id;
        this.titre = titre;
        this.artistes = artistes;
        this.albums = albums.map(x => x[0]).join(', ');
        this.duree = duree;
    }

    closeModal = () => {
        this.setState({
            "modalIsOpen" : false,
            "images" : [],
            "imagesAreLoaded" : false,
        });
        this.id = "";
        this.titre = "";
        this.artistes = "";
        this.albums = "";
        this.duree = "";
    }

    displayPictures = (images) => {
        this.setState({
            "images" : [...this.state.images, ...images],
            "imagesAreLoaded" : true,
        });
    }

    render() {
        const {query, queryField, modalIsOpen, images, imagesAreLoaded} = this.state;

        return (
            <div className="App">
                <Header />
                <RecordingDetails modalIsOpen={modalIsOpen} closeModal={this.closeModal} id={this.id} titre={this.titre} artistes={this.artistes} albums={this.albums} images={images} imagesAreLoaded={imagesAreLoaded} genres={this.genres} rating={this.rating} duree={this.duree} />
                <main>
                    <SearchForm updateResultContainer={this.updateResultContainer} generateNewToken={this.generateNewToken} />
                    <ResultContainer query={query} queryField={queryField} token={this.queryToken} continuer={this.continuer} openModal={this.openModal} />
                </main>
                <Footer />
            </div>
        );
    }
}

export default App;
