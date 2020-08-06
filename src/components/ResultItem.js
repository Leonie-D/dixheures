import React from 'react';

class ResultItem extends React.Component {
    render() {
        const {id, rang, titre, artiste, album} = this.props;
        return (
            <tr>
                <td>{rang}</td>
                <td>{titre}</td>
                <td>{artiste}</td>
                <td>{album}</td>
                <td>
                    <button id={id}> + </button>
                </td>
            </tr>
        );
    }
}

export default ResultItem;