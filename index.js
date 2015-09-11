module.exports = {
  enableOn: function ( el ) {
    var Tap = require( './touchy' );
    var ins = new Tap( el );
    return ins;
  }
};
