/**
* Spotify Port Scanner
* @see https://github.com/loretoparisi/spotify-port-scanner-node
* @copyright 2016 https://github.com/loretoparisi/spotify-port-scanner-node/blob/master/LICENSE.md
* @author Loreto Parisi (loretoparisi at gmail dot com)
*/

(function() {
  var SpotifySDK;
  SpotifySDK = {
    PortScanner : require('./portscanner'),
    SpotifyClient : require('./spotifyclient'),
    Util  : require('./util')
  }
  module.exports = SpotifySDK;
}).call(this);
