"use strict";
exports.__esModule = true;
var react_1 = require("react");
var ReactDOM = require("react-dom");
var AuthProvider_1 = require("./components/AuthProvider");
var Layout_1 = require("./components/Layout");
ReactDOM.render(<react_1.Suspense fallback="Loading...">
    <AuthProvider_1["default"]>
      <Layout_1["default"] />
    </AuthProvider_1["default"]>
  </react_1.Suspense>, document.getElementById('app'));
