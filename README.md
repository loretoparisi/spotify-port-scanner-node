## spotify-port-scanner-node
Node tool to scan for Spotify application listening ports

###Install
Do a

```shell
npm install
```

###Usage
See examples in `examples/` folder. Basic usage as follows:

```javascript

// lower port number
var startPort = 3000;
// higher port number
var endPort = 5000;

var options = {
    host : 'localhost',
    timeout : 500, // socket timeout in msec
    all : true // := bool | true = this to scan  all ports, false= break at first port
};

// find ports in use with state `open`
portscanner.findAPortInUse(startPort, endPort, options, function(error, ports) {
  console.log( ports );
});
```

This will output an array of available ports like

```shell
[ 3445, 4370, 4371, 4380, 4382 ]
```

A node support protocol will be then initialized with each port to detect a valid protocol to talk to

```javascript
ports.map(function(item,index){

  var spotify = new nodeSpotifyWebHelper.SpotifyWebHelper( { port : item });
  console.log("Testing port: [%d]", item);
  spotify.getVersion(function (err, res) {
    if (err) {
      return console.error( err );
    }
    console.info(res);
    try {

      var jsonResponse=JSON.parse( JSON.stringify(res) );
      if( jsonResponse.client_version && jsonResponse.version ) { // spotify local protocol

        console.log("Connecting to Spotify on port [%d]...", item);
        var spotify = new nodeSpotifyWebHelper.SpotifyWebHelper( { port : item });

        spotify.getStatus(function (err, res) {
          if (err) {
            return console.error(err);
          }
          console.info('Currently Playing:',
            res.track.artist_resource.name, '-',
            res.track.track_resource.name);
        });
        return console.log("Spotify is listening on port [%d]", item);
      }
      else { // bad protocol
          return console.error( new Error('bad protocol response') );
      }
    } catch(ex) { // bad protocol
      return console.error( new Error('bad protocol response') );
    }
  });
});
```
