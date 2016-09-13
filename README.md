## spotify-port-scanner-node
This node module will connect to Spotify desktop application using the `spotilocal` protocol with automatic port detection of the host. This module uses the node module [node-spotify-webhelper](https://github.com/nadavbar/node-spotify-webhelper) to communicate to the host application.

### How to install
To install this module via `npm` type

```
npm install -s spotify-port-scanner
```

To install from sources

```
git clone https://github.com/loretoparisi/spotify-port-scanner-node.git
cd spotify-port scanner/
npm install
```

### Usage
See examples in `examples/` folder for more examples.

Connect the client to the host Spotify application while debugging.
```javascript
var SpotifySDK = require('spotify-port-scanner-node');
var client = new SpotifySDK.SpotifyClient({ debug : true });
client.connect({
  lowPort : 3000,
  highPort : 5000
})
.then(() => {
  console.log("client connected to host %s:%s", client.getHost(), client.getPort());
})
  .catch(error => {
  console.log("client error", error);  
});
```

As soon as the client is connected, to get the host application instance and query for the status:

```javascript
  // get host status
  // get spotify application host
  var host=client.getSpotifyHost();
  host.getStatus(function (error, status) {
    if (error) {
      console.log("host error", err);
    }
    else {
        console.info("host status:", status);
    }
  });
  ```
  
### The host protocol
This is an example of host application protocol.

The response status contains the following fields
```json
{
    "version": 9,
    "client_version": "1.0.36.124.g1cba1920",
    "playing": true,
    "shuffle": false,
    "repeat": false,
    "play_enabled": true,
    "prev_enabled": false,
    "next_enabled": true,
    "track": {
        "track_resource": {
            "name": "Blood Host",
            "uri": "spotify:track:2Y4V0ULxOW5ETI2JhnWFlb",
            "location": {
                "og": "https://open.spotify.com/track/2Y4V0ULxOW5ETI2JhnWFlb"
            }
        },
        "artist_resource": {
            "name": "Scar The Martyr",
            "uri": "spotify:artist:1gz9Dd0N7oCymbjVePlxbq",
            "location": {
                "og": "https://open.spotify.com/artist/1gz9Dd0N7oCymbjVePlxbq"
            }
        },
        "album_resource": {
            "name": "Scar The Martyr (Deluxe)",
            "uri": "spotify:album:0ab4DBE7MXSImsTvIegnHI",
            "location": {
                "og": "https://open.spotify.com/album/0ab4DBE7MXSImsTvIegnHI"
            }
        },
        "length": 407,
        "track_type": "normal"
    },
    "context": {},
    "playing_position": 49.558,
    "server_time": 1473682947,
    "volume": 1,
    "online": true,
    "open_graph_state": {
        "private_session": false,
        "posting_disabled": false
    },
    "running": true
}
```
