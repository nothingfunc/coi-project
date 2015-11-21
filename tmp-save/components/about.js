/**
 * Created by zhengguo.chen on 2015/11/17.
 */
var React = require("react");

class AboutPage extends React.Component {
  render () {
    return <span>About {this.props.about}</span>
  }
}

module.exports = myApp => {
  myApp.value('AboutPage', AboutPage);
  myApp.directive('aboutPage', ['reactDirective', reactDirective =>
    reactDirective(AboutPage, ['about'])
  ]);
}

