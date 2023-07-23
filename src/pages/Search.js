import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Loading from './Loading';
import searchAlbumsAPI from '../services/searchAlbumsAPI';
import lupa from '../images/lupa.png';
import '../css/search.css';

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      searchArt: '',
      cantSearch: true,
      isLoading: false,
      music: undefined,
      artist: '',
      firstLoad: true,
    };
  }

  onKeyPressHandler = () => {
    console.log('onKeyPressHandler');
  };

  fazBusca = (artist) => {
    searchAlbumsAPI(artist)
      .then((resp) => this.setState((stateBefore) => ({
        music: resp,
        artist: stateBefore.searchArt,
        isLoading: false,
        searchArt: '',
        firstLoad: false,
      })));
    this.setState({ isLoading: true });
  };

  habilitaBtnEnter = () => {
    const { searchArt } = this.state;
    const minCarac = 2;
    const possoBuscar = searchArt.length >= minCarac;
    if (possoBuscar) {
      this.setState({
        cantSearch: false,
      });
    } else {
      this.setState({
        cantSearch: true,
      });
    }
  };

  mudaBtn = ({ target }) => {
    const { name, type, checked } = target;
    const value = type === 'checkbox' ? checked : target.value;
    this.setState({
      [name]: value,
    }, () => this.habilitaBtnEnter());
  };

  render() {
    const { searchArt, cantSearch, isLoading, artist, music, firstLoad } = this.state;
    return (
      <>
        <Header />
        <div
          data-testid="page-search"
          id="div-search"
        >
          {isLoading
            ? <Loading />
            : (
              <form id="form-search">
                <input
                  data-testid="search-artist-input"
                  name="searchArt"
                  value={ searchArt }
                  type="text"
                  placeholder="Nome do Artista"
                  onChange={ this.mudaBtn }
                  id="input-search"
                />
                <button
                  type="button"
                  data-testid="search-artist-button"
                  disabled={ cantSearch }
                  onClick={ () => this.fazBusca(searchArt) }
                  id="btn-search"
                >
                  <img src={ lupa } alt="imagem de uma lupa" />
                </button>
              </form>)}
          <div>
            {artist ? <p>{`Resultado de álbuns de: ${artist}`}</p> : null}
          </div>
          <div>
            { (firstLoad && <div> </div>)
          || (music.length > 0
            ? (
              music.map(({ artistName,
                collectionId,
                collectionName,
                artworkUrl100,
              }, ind) => (
                <Link
                  to={ `/trybetunes/album/${collectionId}` }
                  key={ collectionId }
                >
                  <section
                    role="link" // Coment: 1
                    onKeyPress={ this.onKeyPressHandler } // Coment: 2
                    tabIndex={ ind }
                    data-testid={ `link-to-album-${collectionId}` }

                  >
                    <img src={ artworkUrl100 } alt={ collectionName } />
                    <p><strong>{collectionName}</strong></p>
                    <p>{artistName}</p>
                  </section>
                </Link>
              ))
            )
            : <p>Nenhum álbum foi encontrado</p>)}
          </div>
        </div>
      </>
    );
  }
}
export default Search;
// Coments:
// 1 - https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/bccf0aeab8dd337c5f134f892a6d3588fbc29bdf/docs/rules/interactive-supports-focus.md
// 2 - https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/bccf0aeab8dd337c5f134f892a6d3588fbc29bdf/docs/rules/no-static-element-interactions.md
