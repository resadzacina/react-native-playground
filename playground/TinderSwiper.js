'use strict';

var React = require('react-native');
var moment = require('moment');
var clamp = require('clamp');

var {
  AppRegistry, StyleSheet, Text, View, Animated, Component, PanResponder, Image
  } = React;

const Items = [
  'grey',
  'blue',
  'maroon',
  'grey',
  'black',
]

var SWIPE_THRESHOLD = 120;

class TinderSwiper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(0.5),
      person: Items[0],
    }
  }

  _goToNextItem() {
    let currentPersonIdx = Items.indexOf(this.state.person);
    let newIdx = currentPersonIdx + 1;

    this.setState({
      person: Items[newIdx > Items.length - 1 ? 0 : newIdx]
    });
  }

  componentDidMount() {
    this._animateEntrance();
  }

  _animateEntrance() {
    Animated.spring(
      this.state.enter,
      { toValue: 1, friction: 8 }
    ).start();
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});
      },

      onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y},
      ]),

      onPanResponderRelease: (e, {vx, vy}) => {
        var me = this;
        me.state.pan.flattenOffset();
        var velocity;

        if (vx >= 0) {
          velocity = clamp(vx, 3, 5);
        } else if (vx < 0) {
          velocity = clamp(vx * -1, 3, 5) * -1;
        }

        if (Math.abs(me.state.pan.x._value) > SWIPE_THRESHOLD) {
          Animated.decay(me.state.pan, {
            velocity: {x: velocity, y: vy},
            deceleration: 0.98
          }).start(me._resetState(me))
        } else {
          Animated.spring(me.state.pan, {
            toValue: {x: 0, y: 0},
            friction: 4
          }).start()
        }
      }
    })
  }

  _resetState(me) {
    me.state.pan.setValue({x: 0, y: 0});
    me.state.enter.setValue(0);
    me._goToNextItem();
    me._animateEntrance();
  }

  render() {
    let { pan, enter, } = this.state;

    let [translateX, translateY] = [pan.x, pan.y];

    let rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"]});
    let opacity = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: [0.5, 1, 0.5]})
    let scale = enter;

    let animatedCardStyles = {transform: [{translateX}, {translateY}, {rotate}, {scale}], opacity};

    let yesOpacity = pan.x.interpolate({inputRange: [0, 150], outputRange: [0, 1]});
    let yesScale = pan.x.interpolate({inputRange: [0, 150], outputRange: [0.5, 1], extrapolate: 'clamp'});
    let animatedYesStyles = {transform: [{scale: yesScale}], opacity: yesOpacity}

    let noOpacity = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0]});
    let noScale = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0.5], extrapolate: 'clamp'});
    let animatedNoStyles = {transform: [{scale: noScale}], opacity: noOpacity}

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.card, animatedCardStyles, {backgroundColor: this.state.person}]} {...this._panResponder.panHandlers}>
        <Image
          source={require('image!tom')}
          style={{
           height: 36,
           width: 36,
           borderRadius: 18
          }}
        />
        <View style={{paddingLeft: 5, paddingTop: 20}}>
          <Text>
            Info
          </Text>
          <Text>
            More Info
          </Text>
          <Text>
            Something Else
          </Text>
          <Text>
            Voila
          </Text>
         </View>
        </Animated.View>

        <Animated.View style={[styles.no, animatedNoStyles]}>
          <Text style={styles.noText}>No!</Text>
        </Animated.View>

        <Animated.View style={[styles.yes, animatedYesStyles]}>
          <Text style={styles.yesText}>Yezz!</Text>
        </Animated.View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  card: {
    width: 200,
    height: 300,
    padding: 20,
    backgroundColor: 'red',
  },
  yes: {
    borderColor: 'green',
    borderWidth: 2,
    position: 'absolute',
    padding: 20,
    bottom: 60,
    borderRadius: 5,
    right: 20,
  },
  yesText: {
    fontSize: 16,
    color: 'green',
  },
  no: {
    borderColor: 'red',
    borderWidth: 2,
    position: 'absolute',
    bottom: 60,
    padding: 20,
    borderRadius: 5,
    left: 20,
  },
  noText: {
    fontSize: 16,
    color: 'red',
  }
});

module.exports = TinderSwiper;
