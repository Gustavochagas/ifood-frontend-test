import axios from 'axios';


interface IGetPlaylist {
  locale: string;
  timestamp: string;
  limit: number;
  offset: number;
  country: string;
}
class SpotifyService {
  private token = '';

  public authorization() {
    const client_id = '5697d492033e48e8bbf0f1a30c52d907'; // Your client id
    const redirect_uri = 'http://localhost:3000'; // Your redirect uri
    const authEndpoint = 'https://accounts.spotify.com';
    const scopes = 'user-read-private user-read-email playlist-read-collaborative';

    return `${authEndpoint}/authorize?response_type=token&client_id=${client_id}&scope=${scopes}&redirect_uri=${redirect_uri}`;
  }

  public hasToken() {
    this.token = localStorage.getItem('SpotifyToken') || '';

    this.getUser();

    return Boolean(this.token);
  }

  public async getUser() {
    const authEndpoint = 'https://api.spotify.com/v1';
    try {
      const user = await axios.get(`${authEndpoint}/me`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });

      return user.data;
    } catch (e) {
      SpotifyServiceAuth.logout();
    }
  }

  public logout() {
    localStorage.removeItem('SpotifyToken');
    window.location.href = '/';
  }

  public async getPlaylists({ locale, timestamp, limit, offset, country }: IGetPlaylist) {
    const authEndpoint = 'https://api.spotify.com/v1';
    try {
      const qs = `locale=${locale}&timestamp=${timestamp}&limit=${limit}&offset=${offset}&country=${country}`;

      const playlist = await axios.get(`
        ${authEndpoint}/browse/featured-playlists?${qs}`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });

      return playlist.data.playlists.items;
    } catch (e) {
      throw e;
    }
  }
}

export const SpotifyServiceAuth = new SpotifyService();
