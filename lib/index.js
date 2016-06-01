/**
* Spotify Port Scanner
* @see https://github.com/loretoparisi/spotify-port-scanner-node
* @author Loreto Parisi (loretoparisi at musixmatch dot com)
*/

(function() {
  var SpotifyPortScanner;
  SpotifyPortScanner = {
    WebHelper : require('./spotifywebhelper'),
    PortScanner : require('./portscanner'),
    Util : require('./util')
  }
  module.exports = SpotifyPortScanner;
}).call(this);
