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
