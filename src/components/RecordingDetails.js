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

        const {titre, artistes, albums, images, imagesAreLoaded, genres, rating, duree} = this.props;

        return (
            <Modal
                className="recording-details"
                isOpen={this.props.modalIsOpen}
                onRequestClose={this.props.closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <header>
                    <h2>{titre}</h2>
                    <button onClick={this.props.closeModal}>Fermer</button>
                </header>
                <ul className="details">
                    <li><strong>Artiste(s)</strong> : {artistes}</li>
                    <li><strong>Album(s)</strong> : {albums}</li>
                    <li><strong>Genre(s)</strong> : {genres}</li>
                    <li><strong>Durée</strong> : {isNaN(duree) ? duree : ~~(duree/60000) + ":" + Math.round((duree%60000)/1000)}</li> {/*encore plus juste : moyenner les durées de tous les albums...*/}
                    <li><strong>Note</strong> : {rating}</li>
                </ul>
                <hr/>
                <div className="galerie">
                    {imagesAreLoaded ? (images.length > 0 ? images.map((url, index) => <img key={index} src={url}/>) : <p>Aucune image disponible</p>) : <p>Chargement...</p>}
                </div>
            </Modal>
        );
    }
}

export default RecordingDetails;