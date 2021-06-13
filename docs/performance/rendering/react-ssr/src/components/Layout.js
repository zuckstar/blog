import React from "react";
class Layout extends React.Component {
  constructor() {
    super();
    this.state = {
      title: "Welcome to React SSR!",
    };
  }
  render () {
    return (
      <div>
        <h1>{this.state.title}</h1>
      </div>
    );
  }
}
export default Layout;