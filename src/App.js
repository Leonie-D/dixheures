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
        this.artiste = "";
        this.album = "";
        this.images = [];
        this.rating = "";
        this.duree = "";
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

    openModal = (id, titre, artiste, album, albumId, genres, rating, duree) => {
        this.setState({
            "modalIsOpen" : true,
        });
        getPictures(albumId, this.displayPictures);

        this.id = id;
        this.titre = titre;
        this.artiste = artiste;
        this.album = album;
        this.genres = genres;
        this.rating = rating;
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
        this.artiste = "";
        this.album = "";
        this.images = [];
        this.genres = "";
        this.rating = "";
        this.duree = "";
    }

    displayPictures = (images) => {
        this.setState({
            "images" : images,
            "imagesAreLoaded" : true,
        });
    }

    render() {
        const {query, queryField, modalIsOpen, images, imagesAreLoaded} = this.state;

        return (
            <div className="App">
                <Header />
                <RecordingDetails modalIsOpen={modalIsOpen} closeModal={this.closeModal} id={this.id} titre={this.titre} artiste={this.artiste} album={this.album} images={images} imagesAreLoaded={imagesAreLoaded} genres={this.genres} rating={this.rating} duree={this.duree} />
                <main>
                    <SearchForm updateResultContainer={this.updateResultContainer} />
                    {query === "" ? <p>Que puis-je faire pour toi ?</p> : <ResultContainer query={query} queryField={queryField} openModal={this.openModal} />}
                </main>
                <Footer />
            </div>
        );
    }
}

export default App;
