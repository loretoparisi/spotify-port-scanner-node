/**
* Spotify Port Scanner
* @see https://github.com/loretoparisi/spotify-port-scanner-node
* @author Loreto Parisi (loretoparisi at gmail dot com)
*/
(function() {

  var SpotifyPortScanner = require('../lib/index');
  var portscanner = SpotifyPortScanner.PortScanner;

  var spotifyClient = new SpotifyPortScanner.WebHelper(); // init with default port

  var localhostName = spotifyClient.getLocalHostname();
  console.log( "Host is " + localhostName );

  var lowPort = 3000;
  var highPort = 5000;
  var options = {
      host : localhostName,
      timeout : 500, // socket timeout in msec
      all : true
  };

  portscanner.findAPortInUse(lowPort, highPort, options, function(error, ports) {
    if(!error) {

      console.log("Open ports on domain %s", localhostName, ports );

      // test ports and wait for a response
      SpotifyPortScanner.Util.promiseAll( ports
        , function(item,index,resolve,reject) { // item block

          var spotifyClient = new SpotifyPortScanner.WebHelper( { port : item });
          console.log("Testing port: [%d]", item);
          spotifyClient.getVersion(function (err, res) {
            if (err) {
              return resolve( { error : err , port : item } );
            }
            console.info(res);
            try {
              var jsonResponse=JSON.parse( JSON.stringify(res) );
              if( jsonResponse.client_version && jsonResponse.version ) { // spotify local protocol
                console.log("Spotify is listening on port [%d]", item);
                return resolve( { port : item } );
              }
              else { // bad protocol
                  var error = new Error('bad protocol response');
                  return resolve( { error : error, port : item } );
              }
            } catch(ex) { // bad protocol
              var error = new Error('bad protocol response');
              return resolve( { error : error , port : item } );
            }
          });
        }
      , function(ports) { // all done

        // filtering out ports with errors not supporting spotify local protocol
        var openPorts = ports.filter(function(p,index) {
            return !p.error
        });

        console.log("Spotify open ports responding to local protocol", openPorts);

        var selectedPort = openPorts[0].port;

        console.log("Connecting to Spotify on port [%d]...", selectedPort );
        var spotifyClient = new SpotifyPortScanner.WebHelper( { port : selectedPort });
        spotifyClient.getStatus(function (err, res) {
          if (err) {
            return console.error(err);
          }
          console.info('Currently Playing:',
            res.track.artist_resource.name, '-',
            res.track.track_resource.name);
        });
      }
      , function(error) { // error
        console.error("Unexpected error occurred",error);
      });

    }
    else {
        console.error("Error scanning ports on" + localhostName, error );
    }
  })

}).call(this);
