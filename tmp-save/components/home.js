/**
 * Created by zhengguo.chen on 2015/11/17.
 */
var React = require("react");
class HomeComponent extends React.Component {
  render() {
    let {onClick, fname, lname} = this.props.store;
    return <div>
      <span onClick={onClick}>Hello {fname} {lname}</span>
    </div>
  }
}

module.exports = myApp => {
  myApp.value('HomeComponent', HomeComponent);
  myApp.directive('homeComponent', ['reactDirective', reactDirective =>
    reactDirective(HomeComponent, ['store'])
  ]);
}
