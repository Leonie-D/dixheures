import React from 'react';

class ResultItem extends React.Component {
    openInfoModal = () => {
        const {id, titre, artiste, album, openModal, genres, rating} = this.props;
        openModal(id, titre, artiste, album, genres, rating);
    }

    render() {
        const {rang, titre, artiste, album} = this.props;
        return (
            <tr>
                <td>{rang}</td>
                <td>{titre}</td>
                <td>{artiste}</td>
                <td>{album}</td>
                <td>
                    <button onClick={this.openInfoModal}> + </button>
                </td>
            </tr>
        );
    }
}

export default ResultItem;