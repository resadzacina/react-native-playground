'use strict';

var React = require('react-native');
var Swiper = require('react-native-swiper');
var CameraRollView = require('./CameraRollView.ios');
var Mapbox = require('react-native-mapbox-gl');
var mapRef = 'mapRef';

var {
    Text,
    View,
    Component,
    StyleSheet,
    TabBarIOS,
    StatusBarIOS,
    CameraRoll
} = React;

var CAMERA_ROLL_VIEW = 'camera_roll_view';

class AppContainer extends Component {
    constructor(props){
        super(props);

        this.state = {
            selectedTab: 'feed',
            groupTypes: 'SavedPhotos',
            sliderValue: 1,
            bigImages: true
        }
    }



    render(){
      return (
        <TabBarIOS style={styles.container}>
            <TabBarIOS.Item
                title="Feed"
                selected={this.state.selectedTab == 'feed'}
                icon={require('image!inbox')}
                onPress={()=> this.setState({selectedTab: 'feed'})}
            >
              <Swiper style={styles.wrapper} showsButtons={true}>
                <View style={styles.slide1}>
                  <Text style={styles.text}>Item 1</Text>
                </View>
                <View style={styles.slide2}>
                  <Text style={styles.text}>Item 2</Text>
                </View>
                <View style={styles.slide3}>
                  <Text style={styles.text}>Item 3</Text>
                </View>
              </Swiper>
            </TabBarIOS.Item>
            <TabBarIOS.Item
                title="Search"
                selected={this.state.selectedTab == 'search'}
                icon={require('image!search')}
                onPress={()=> this.setState({selectedTab: 'search'})}
            >
                <Text style={styles.welcome}>Tab 2</Text>
            </TabBarIOS.Item>
            <TabBarIOS.Item
              title="Camera"
              selected={this.state.selectedTab == 'camera'}
              icon={require('image!search')}
              onPress={()=> this.setState({selectedTab: 'camera'})}
            >
              <CameraRollView
                ref={CAMERA_ROLL_VIEW}
                batchSize={20}
                groupTypes={this.state.groupTypes}
                renderImage={this._renderImage}
              />
            </TabBarIOS.Item>
            <TabBarIOS.Item
              title="Map"
              selected={this.state.selectedTab == 'map'}
              icon={require('image!search')}
              onPress={()=> this.setState({selectedTab: 'map'})}
            >
            <MapExample />
            </TabBarIOS.Item>
        </TabBarIOS>
      );
    }

    loadAsset(asset){
      this.props.navigator.push({
        title: 'Camera Roll Image',
        component: AssetScaledImageExampleView,
        backButtonTitle: 'Back',
        passProps: { asset: asset },
      });
    }

    _renderImage(asset) {
      var imageSize = this.state.bigImages ? 150 : 75;
      var imageStyle = [styles.image, {width: imageSize, height: imageSize}];
      var location = asset.node.location.longitude ?
        JSON.stringify(asset.node.location) : 'Unknown location';
      return (
        <TouchableOpacity onPress={ this.loadAsset.bind( this, asset ) }>
          <View key={asset} style={styles.row}>
            <Image
              source={asset.node.image}
              style={imageStyle}
            />
            <View style={styles.info}>
              <Text style={styles.url}>{asset.node.image.uri}</Text>
              <Text>{location}</Text>
              <Text>{asset.node.group_name}</Text>
              <Text>{new Date(asset.node.timestamp).toString()}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    _onSliderChange(value) {
      var options = CameraRoll.GroupTypesOptions;
      var index = Math.floor(value * options.length * 0.99);
      var groupTypes = options[index];
      if (groupTypes !== this.state.groupTypes) {
        this.setState({groupTypes: groupTypes});
      }
    }

    _onSwitchChange(value) {
      this.refs[CAMERA_ROLL_VIEW].rendererChanged();
      this.setState({ bigImages: value });
    }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  wrapper: {
  },
  slide1: {
    //flex: 1,
    paddingTop: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    paddingTop: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
});

module.exports = AppContainer;