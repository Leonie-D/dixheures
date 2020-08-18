import React from 'react';

class ResultItem extends React.Component {
    openInfoModal = () => {
        const {id, titre, artistes, albums, openModal, duree} = this.props;
        openModal(id, titre, artistes, albums, duree);
    }

    render() {
        const {rang, titre, artistes, albums} = this.props;

        return (
            <tr>
                <td>{rang}</td>
                <td>{titre}</td>
                <td>{artistes}</td>
                <td>{albums[0][0] + (albums.length > 1 ? (" [+" + (albums.length - 1) + " album(s)]") : "")}</td>
                <td>
                    <button onClick={this.openInfoModal}>
                        <svg viewBox="0 0 448 448" xmlns="http://www.w3.org/2000/svg">
                            <path d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0"/>
                        </svg>
                    </button>
                </td>
            </tr>
        );
    }
}

export default ResultItem;