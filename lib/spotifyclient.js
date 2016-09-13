/**
* Spotify Port Scanner
* @see https://github.com/nadavbar/node-spotify-webhelper
* @copyright 2016 https://github.com/loretoparisi/spotify-port-scanner-node/blob/master/LICENSE.md
* @author Loreto Parisi (loretoparisi at gmail dot com)
*/
(function() {

var WebHelper = require('node-spotify-webhelper');

var PortScanner = require('./portscanner');
var Util = require('./util')

var SpotifyClient;
SpotifyClient = (function() {

    /**
     * Spotify Client helper
     * Auto detect spotify host ports and connects the client to it
     */
    function SpotifyClient(options) {

        /** Default module options */
        this.options = {
            lowPort : 3000,
            highPort : 5000,
            timeout : 500,
            all : true,
            debug : false
        };

        // override
        for (var attrname in options) { this.options[attrname] = options[attrname]; }

        /** Spotify host port - defaults to 4370 */
        this.port = 4370;

        /** Spotify application host name */
        this.host = '';

        /** Spotify Web Helper instance */
        this.spotifyHost = new WebHelper.SpotifyWebHelper();

        /** automatic port detection */
        this._detect = function(options,callback) {
            var self=this;

            
            // override defaults
            for (var attrname in options) { this.options[attrname] = options[attrname]; }
            
            this.options.host = this.host;
            var debug = self.options.debug;

            // this is a patch to the module 
            // @see https://github.com/nadavbar/node-spotify-webhelper
            this.host = self.spotifyHost.getLocalHostname();

            if(debug) console.log("SpotifyClient - using\n", this.options);

            PortScanner.findAPortInUse(this.options.lowPort, this.options.highPort, this.options
            , function(error, ports) {
                if(!error) {

                    if(debug) console.log("SpotifyClient - host %s open ports", self.host, ports );

                    // test ports and wait for a response
                    Util.promiseAll( ports
                        , function(item,index,resolve,reject) { // item block
                            // local web helper instance
                            var spotifyHost = new WebHelper.SpotifyWebHelper( { port : item });
                            if(debug) console.log("SpotifyClient - testing port: [%d]", item);

                            // this is a patch to the module 
                            // @see https://github.com/nadavbar/node-spotify-webhelper
                            spotifyHost.getVersion(function (err, res) {
                                if (err) { // protocol KO
                                    return resolve( { error : err , port : item } );
                                }
                                else { // protocol OK
                                    if(debug) console.info(res);
                                    try {
                                        var jsonResponse=JSON.parse( JSON.stringify(res) );
                                        if( jsonResponse.client_version && jsonResponse.version ) { // spotify local protocol
                                            if(debug) console.log("SpotifyClient - listening on port [%d]", item);
                                            return resolve( { port : item, error : undefined } );
                                        }
                                        else { // bad protocol
                                            var error = new Error('bad protocol response');
                                            return resolve( { error : error, port : item } );
                                        }
                                    } catch(ex) { // bad protocol
                                        var error = new Error('bad protocol response');
                                        return resolve( { error : error , port : item } );
                                    }
                                }
                            });
                        }
                    , function(ports) { // all done

                        // filtering out ports with errors not supporting spotify local protocol
                        var openPorts = ports.filter(function(p,index) {
                            return !p.error
                        });
                        if( openPorts.length > 0) {
                            // order ports by port number - lower port is the comm port
                            // higher port is the admin port
                            // @TODO find a method to detect admin port protocol
                            var sortable = [];
                            for (var p in openPorts)
                                sortable.push( [p, openPorts[p].port] )
                            sortable.sort(function(a, b) {
                                return a[1] - b[1]
                            });

                            if(debug) console.log("SpotifyClient - open ports\n", openPorts, sortable);
                            // lower ordered port number
                            self.port = sortable[0][1];

                            if(debug) console.log("SpotifyClient - connecting to port [%d]...", self.port );
                            self.spotifyHost = new WebHelper.SpotifyWebHelper( { port : self.port });
                            self.spotifyHost.getStatus(function (err, res) {
                                if (err) {
                                    if(debug) console.error(err);
                                    return callback.apply(this,[error]);
                                }
                                else {
                                    return callback.apply(this);
                                }
                            });
                        }
                        else { // no port open without errors
                            var error = new Error('no port opened');
                            return callback.apply(this,[error]);
                        }
                    }
                    , function(error) { // error
                        if(debug) console.error("SpotifyClient - open error", error);
                        return callback.apply(this,[error]);
                    });

                } else {
                    if(debug) console.error("SpotifyClient - scan error" , error );
                    return callback.apply(this,[error]);
                }
            })  
        }//detect

    }

    /**
     * Connect to Spotify host with automatic port detection
     * @param options Object 
     
        {
            lowPort :=int {lower port number}
            highPort :=int {higher port number}
            timeout =: int {socket connection timeout}
            all := bool {scan all ports in the specified interval}
        }

     */
    SpotifyClient.prototype.connect = function(options) {
        var self=this;
        return new Promise((resolve, reject) => {
        self._detect(options, function(err) {
          if(err) reject(err);
          else resolve();
        });
      });     
    }//connect

    /**
     * Get the current spotify application host
     * @return function
     */
    SpotifyClient.prototype.getSpotifyHost = function() {
        return this.spotifyHost;
    }//getSpotifyHost

    /**
     * @return string Spotify application host name
     */
    SpotifyClient.prototype.getHost = function() { return this.host; }

    /**
     * @return int Spotify host port - defaults to 4370
     */
    SpotifyClient.prototype.getPort = function() { return this.port; }

    return SpotifyClient;

})();

module.exports = SpotifyClient;

}).call(this);