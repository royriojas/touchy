var container = document.getElementById( 'container' );
var button1 = document.getElementById( 'button-1' );
var button2 = document.getElementById( 'button-2' );
var button3 = document.getElementById( 'button-3' );
var output = document.getElementById( 'output' );

require( './' ).enableOn( document );

function callback( e ) {
  e.preventDefault();

  var p = document.createElement( 'p' );
  p.textContent = 'event: ' + e.type;

  if ( e.type === 'swipe' ) {
    if ( e.detail ) {
      p.textContent += ', ' + e.detail.direction;
    }
  }

  output.insertBefore( p, output.firstChild );

}

button1.addEventListener( 'click', callback, false );
button2.addEventListener( 'tap', callback, false );
button3.addEventListener( 'tap:hold', callback, false );

container.addEventListener( 'swipe', callback, false );

container.addEventListener( 'swipe:left', callback, false );
container.addEventListener( 'swipe:right', callback, false );
container.addEventListener( 'swipe:up', callback, false );
container.addEventListener( 'swipe:down', callback, false );

document.addEventListener( 'touchmove', function ( e ) {
  e.preventDefault();
} );
