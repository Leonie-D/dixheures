import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {getArtistsByName} from "../api/musicAPI";

class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "artists" : null
        };
    }

    updateArtists = (artists) => {
        this.setState({
            "artists" : artists
        });
    }

    componentDidMount() {
        getArtistsByName("mado", this.updateArtists);
    }

    functiond = () => {}

    render() {
        const options = [
            'Artiste', 'Titre', 'Album', 'Tous les champs'
        ];
        const defaultOption = options[0];

        return(
            <form onSubmit={this.submit}>
                <input type="text" name="query" placeholder="Please enter an artist name, album title or song title"></input>
                <Dropdown options={options} value={defaultOption} placeholder="Select an option" />
                <button>Rechercher</button>
            </form>
        );
    }
}

export default SearchForm;