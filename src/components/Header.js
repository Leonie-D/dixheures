import React from 'react';

class Header extends React.Component {
    render(){
        return(
            <header>
                <h1>Dixheures</h1>
                <p>
                    Cherche et trouve ta musique
                    <span>(si tu connais déjà le titre, l'album ou l'artiste)</span>
                </p>
                <p>Pour l'écouter, c'est Ailheure...</p>
            </header>
        );
    }
}

export default Header;