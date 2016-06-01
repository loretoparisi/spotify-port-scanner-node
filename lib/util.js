/**
* Spotify Port Scanner
* @see https://github.com/loretoparisi/spotify-port-scanner-node
* @author Loreto Parisi (loretoparisi at gmail dot com)
*/
(function() {

  /**
  * @author Loreto Parisi (loretoparisi at gmail dot com)
  */
  var Util = {

    /***************
     * Function Utils
     ****************/

    /**
     * Promise.All
     * @param items Array of objects
     * @param block Function block(item,index,resolve,reject)
     * @param done Function Success block
     * @param fail Function Failure block
     * @example

        promiseAll(["a","b","c"],
        function(item,index,resolve,reject) {
          MyApp.call(item,function(result) {
            resolve(result);
          },
          function( error ) { reject(error); }):
        },
        function(result) { // aggregated results

        },function(error) { // error

        })

      * @author Loreto Parisi (loretoparisi at gmail dot com)
     */
    promiseAll : function(items, block, done, fail) {
      var promises = [], index=0;
      items.forEach(function(item) {
        promises.push( function(item,i) {
            return new Promise(function(resolve, reject) {
              if(block) block.apply(this,[item,index,resolve,reject]);
            });
          }(item,++index))
      });
      Promise.all(promises).then(function AcceptHandler(results) {
        if(done) done( results );
      }, function ErrorHandler(error) {
        if(fail) fail( error );
      });
    } //promiseAll

  } //Util

  module.exports = Util;

}).call(this);
