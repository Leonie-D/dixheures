import React from 'react';

class ResultItem extends React.Component {
    render() {
        const {id, titre, artiste, album} = this.props;
        return (
            <tr>
                <td></td>
                <td>{titre}</td>
                <td>{artiste}</td>
                <td>{album}</td>
                <td>
                    <button id={id}> +</button>
                </td>
            </tr>
        );
    }
}

export default ResultItem;