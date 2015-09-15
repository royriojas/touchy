var debounce = require( 'debouncy' );
var extend = require( 'extend' );
var eventHelper = require( 'dom-event-special' );

function Touchy( el, opts ) {
  var me = this;

  me._opts = {
    minSwipeDeltaX: 25,
    minSwipeDeltaY: 25,
    tap: true,
    taphold: true,
    swipe: true,
    minTapDisplacementTolerance: 10,
    tapHoldMinThreshold: 500,
    swipeThreshold: 1000,
    mousedownThreshold: 500,
    discardTapholdIfMove: true
  };

  extend( me._opts, opts );

  var ele = me.el = (typeof el === 'object' && el !== null) ? el : document.getElementById( el );
  me.moved = false;
  me.startX = 0;
  me.startY = 0;

  me._mouseEventsAllowed = true;

  me.setMouseEventsAllowed = debounce( function () {
    me._mouseEventsAllowed = true;
  }, me._opts.mousedownThreshold );

  ele.addEventListener( 'touchstart', me, false );
  ele.addEventListener( 'mousedown', me, false );
}

var tapProto = Touchy.prototype;

tapProto.blockMouseEvents = function () {
  var me = this;
  me._mouseEventsAllowed = false;
  me.setMouseEventsAllowed();
};

tapProto._getClientX = function ( e ) {
  if ( e.touches && e.touches.length > 0 ) {
    return e.touches[ 0 ].clientX;
  }
  return e.clientX;
};

tapProto._getClientY = function ( e ) {
  if ( e.touches && e.touches.length > 0 ) {
    return e.touches[ 0 ].clientY;
  }
  return e.clientY;
};

tapProto._getPageX = function ( e ) {
  if ( e.touches && e.touches.length > 0 ) {
    return e.touches[ 0 ].pageX;
  }
  return e.pageX;
};

tapProto._getPageY = function ( e ) {
  if ( e.touches && e.touches.length > 0 ) {
    return e.touches[ 0 ].pageY;
  }
  return e.pageY;
};


tapProto.start = function ( e ) {
  var me = this;

  var ele = me.el;

  me.startTime = Date.now();

  if ( e.type === 'touchstart' ) {
    ele.addEventListener( 'touchmove', me, false );
    ele.addEventListener( 'touchend', me, false );
    ele.addEventListener( 'touchcancel', me, false );
    me.checkForTaphold( e );
    me.blockMouseEvents();
  }

  if ( e.type === 'mousedown' && me._mouseEventsAllowed ) {
    ele.addEventListener( 'mousemove', me, false );
    ele.addEventListener( 'mouseup', me, false );
    me.checkForTaphold( e );
  }

  me.startTarget = e.target;

  me.handlingStart = true;

  me.moved = false;
  me.startX = me._getClientX( e ); //e.type === 'touchstart' ? e.touches[ 0 ].clientX : e.clientX;
  me.startY = me._getClientY( e ); //e.type === 'touchstart' ? e.touches[ 0 ].clientY : e.clientY;

};

tapProto.checkForTaphold = function ( e ) {
  var me = this;

  if ( !me._opts.taphold ) {
    return;
  }

  clearTimeout( me.tapHoldInterval );

  me.tapHoldInterval = setTimeout( function () {

    if ( (me.moved && me._opts.discardTapholdIfMove) || !me.handlingStart || !me._opts.taphold ) {
      return;
    }

    eventHelper.fire( me.startTarget, 'tap:hold', {
      bubbles: true,
      cancelable: true,
      detail: {
        pageX: me._getPageX( e ),
        pageY: me._getPageY( e )
      }
    } );
  }, me._opts.tapHoldMinThreshold );
};

tapProto.move = function ( e ) {
  var me = this;

  me._moveX = me._getClientX( e );
  me._moveY = me._getClientY( e );

  var tolerance = me._opts.minTapDisplacementTolerance;
  //if finger moves more than 10px flag to cancel
  if ( Math.abs( me._moveX - this.startX ) > tolerance || Math.abs( me._moveY - this.startY ) > tolerance ) {
    this.moved = true;
  }
};

tapProto.end = function ( e ) {
  var me = this;
  var ele = me.el;

  ele.removeEventListener( 'mousemove', me, false );
  ele.removeEventListener( 'touchmove', me, false );
  ele.removeEventListener( 'touchend', me, false );
  ele.removeEventListener( 'touchcancel', me, false );
  ele.removeEventListener( 'mouseup', me, false );

  var target = e.target;
  var endTime = Date.now();
  var timeDelta = endTime - me.startTime;

  me.handlingStart = false;
  clearTimeout( me.tapHoldInterval );

  if ( !me.moved ) {

    if ( target !== me.startTarget || timeDelta > me._opts.tapHoldMinThreshold ) {
      me.startTarget = null;
      return;
    }

    if ( me._opts.tap ) {
      eventHelper.fire( target, 'tap', {
        bubbles: true,
        cancelable: true,
        detail: {
          pageX: me._getPageX( e ),
          pageY: me._getPageY( e )
        }
      } );
    }

    return;
  }

  if ( !me._opts.swipe || timeDelta > me._opts.swipeThreshold ) {
    return;
  }

  var deltaX = me._moveX - me.startX;
  var deltaY = me._moveY - me.startY;

  var absDeltaX = Math.abs( deltaX );
  var absDeltaY = Math.abs( deltaY );

  var swipeInX = absDeltaX > me._opts.minSwipeDeltaX;
  var swipeInY = absDeltaY > me._opts.minSwipeDeltaY;

  var swipeHappen = swipeInX || swipeInY;

  if ( !swipeHappen ) {
    return;
  }

  var direction = '';

  if ( absDeltaX >= absDeltaY ) {
    direction += (deltaX > 0 ? 'right' : 'left');
  } else {
    direction += (deltaY > 0 ? 'down' : 'up');
  }

  eventHelper.fire( target, 'swipe', {
    bubbles: true,
    cancelable: true,
    detail: {
      direction: direction,
      deltaX: deltaX,
      deltaY: deltaY
    }
  } );

  eventHelper.fire( target, 'swipe:' + direction, {
    bubbles: true,
    cancelable: true,
    detail: {
      direction: direction,
      deltaX: deltaX,
      deltaY: deltaY
    }
  } );
};

tapProto.cancel = function () {
  var me = this;
  clearTimeout( me.tapHoldInterval );

  me.handlingStart = false;
  me.moved = false;
  me.startX = 0;
  me.startY = 0;
};

tapProto.destroy = function () {
  var me = this;
  var ele = me.el;

  me.handlingStart = false;
  clearTimeout( me.tapHoldInterval );

  ele.removeEventListener( 'touchstart', me, false );
  ele.removeEventListener( 'touchmove', me, false );
  ele.removeEventListener( 'touchend', me, false );
  ele.removeEventListener( 'touchcancel', me, false );
  ele.removeEventListener( 'mousedown', me, false );
  ele.removeEventListener( 'mouseup', me, false );
  me.el = null;
};

tapProto.handleEvent = function ( e ) {
  var me = this;
  switch (e.type) {
    case 'touchstart': me.start( e );
      break;
    case 'mousemove': me.move( e );
      break;
    case 'touchmove': me.move( e );
      break;
    case 'touchend': me.end( e );
      break;
    case 'touchcancel': me.cancel( e );
      break;
    case 'mousedown': me.start( e );
      break;
    case 'mouseup': me.end( e );
      break;
  }
};

module.exports = Touchy;
