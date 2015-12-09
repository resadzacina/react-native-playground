'use strict';

var React = require('react-native');
var moment = require('moment');

var {
  Text,
  View,
  Component,
  ListView,
  ActivityIndicatorIOS,
  Image
  } = React;

class ActivityList extends Component {
  constructor(props){
    super(props);

    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    });

    this.state = {
      dataSource: ds.cloneWithRows(['A', 'B', 'C']),
      showProgress: true
    }
  }

  componentDidMount(){
    this.fetchActivityList();
  }

  fetchActivityList(){
    require('./AuthService').getAuthInfo((err, authInfo)=> {
        var url = 'https://api.github.com/users/'
        + authInfo.user.login
        + '/received_events';

        fetch(url, {
          headers: authInfo.header
        })
        .then((response)=> response.json())
        .then((responseData)=>{
          var feedItems =
            responseData.filter((ev)=>
              ev.type == 'PushEvent');
          console.log(feedItems);
          this.setState({
           dataSource: this.state.dataSource
              .cloneWithRows(feedItems),
            showProgress: false
          })


        })

      });
  }

  renderRow(rowData){
    return(
     <View style={{
      flex: 1,
      flexDirection: 'row',
      padding: 20,
      alignItems: 'center',
      borderColor: '#D7D7D7',
      borderBottomWidth: 1
     }}>
       <Image
         source={{uri: rowData.actor.avatar_url}}
         style={{
          height: 36,
          width: 36,
          borderRadius: 18
         }}
       />
       <View style={{paddingLeft: 20}}>
         <Text style={{backgroundColor: '#fff'}}>
           {moment(rowData.created_at).fromNow()}
         </Text>
         <Text style={{backgroundColor: '#fff'}}>
           {rowData.actor.login} pushed to
         </Text>
         <Text style={{backgroundColor: '#fff'}}>
           {rowData.payload.ref.replace('refs/heads/', '')}
         </Text>
         <Text style={{backgroundColor: '#fff'}}>
           at <Text style={{fontWeight: '600'}}>{rowData.repo.name}</Text>
         </Text>
       </View>
     </View>
    );
  }

  render(){
    if(this.state.showProgress){
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center'
        }}>
          <ActivityIndicatorIOS
            size="large"
            animating={true}
          />
        </View>
      )
    }

    return (
      <View style={{
        flex: 1,
        justifyContent: 'flex-start'
      }}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
        />
      </View>
    );
  }
}

module.exports = ActivityList;