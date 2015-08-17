var context = require.context('.', true, /.+\.spec\.jsx?$/);
context.keys().forEach(context);
module.exports = context;

//https://www.codementor.io/reactjs/tutorial/test-reactjs-components-karma-webpack
//http://qiita.com/kimagure/items/f2d8d53504e922fe3c5c