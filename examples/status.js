/**
* Spotify WebHelper + Port Scanner
* @see https://github.com/loretoparisi/node-spotify-webhelper
* @copyright 2016 https://github.com/loretoparisi/spotify-port-scanner-node/blob/master/LICENSE.md
* @author Loreto Parisi (loretoparisi at gmail dot com)
*/
(function() {

var SpotifySDK = require('../lib/index');
var client = new SpotifySDK.SpotifyClient({ debug : true }); // init with defaults
client.connect({
  lowPort : 4000,
  highPort : 5000
})
.then(() => {

  console.log("client connected to host %s:%s", client.getHost(), client.getPort());

  // get spotify application host
  var host=client.getSpotifyHost();

  // get host status
  host.getStatus(function (error, status) {
    if (error) {
      console.log("host error", err);
    }
    else {

        console.info("host status:", JSON.stringify( status, null, 2) );

        console.log("pausing...");
        
        // pause host
        host.pause();
        setTimeout(function() {

          console.log("playing...");

          // play
          host.unpause();
          // get host status
          host.getStatus(function(error, status) {
            if(status) {
              console.log("now playing\n", status.track);  
            }  
          });
        }, 3000);

    }
  });

})
.catch(error => {
  console.log("client error", error);  
});

}).call(this);
