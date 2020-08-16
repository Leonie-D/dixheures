import React from 'react';
import Modal from 'react-modal';

class RecordingDetails extends React.Component {
    componentDidMount() {
        Modal.setAppElement('.App');
    }

    render() {
        const customStyles = {
            content : {
                top                   : '50%',
                left                  : '50%',
                right                 : 'auto',
                bottom                : 'auto',
                marginRight           : '-50%',
                transform             : 'translate(-50%, -50%)'
            }
        };

        const {titre, artiste, album, images, imagesAreLoaded, genres, rating, duree} = this.props;

        return (
            <Modal
                isOpen={this.props.modalIsOpen}
                onRequestClose={this.props.closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <h2>{titre}</h2>
                <ul>
                    <li>artiste(s) : {artiste}</li>
                    <li>album(s) : {album}</li>
                    <li>genre(s) : {genres}</li>
                    <li>durée : {~~(duree/60000) + ":" + Math.round((duree%60000)/1000)}</li>
                    <li>note : {rating === '-' ? rating : rating + "/5"}</li>
                    <li>
                        galerie :
                        <div className="galerie">
                            {imagesAreLoaded ? (images.length > 0 ? images.map((url, index) => <img key={index} src={url}/>) : <p>Aucune image disponible</p>) : <p>Chargement...</p>}
                        </div>
                    </li>
                </ul>
                <button onClick={this.props.closeModal}>Fermer</button>
            </Modal>
        );
    }
}

export default RecordingDetails;