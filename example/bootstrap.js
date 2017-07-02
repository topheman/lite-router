function initView({ location, title, content }, log = true) {
  if (log === true) {
    console.log(`Mounting "${location.pathname}"`);
  }
  document.getElementById('matched-route').innerText = location.pathname;
  document.querySelector('.container h2').innerHTML = title;
  document.querySelector('.container .content').innerHTML = content;
}
function resetView() {
  initView({ location : { pathname: '' }, title: '', content: '' }, false);
}
const compileUnMountMethod = location => () => {
  console.log(`Unmounting from "${location.pathname}"`);
  resetView();
};

const routes = [
  {
    pattern: '/',
    handler: ({ location }) => {
      initView({ location, title: 'Home', content: `Simple pattern matching on <code>/</code>` });
      return compileUnMountMethod(location);
    }
  }, {
    pattern: '/about',
    handler: ({ location }) => {
      initView({ location, title: 'About', content: `Simple pattern matching on <code>/about</code>` });
      return compileUnMountMethod(location);
    }
  }, {
    pattern: '/router/posts/:category/:title/edit',
    handler: ({ location, params }) => {
      initView({location, title: 'Params', content: `
        <p>Pattern matching using params</p>
        <p><strong><code>params</code></strong> passed toyour handler:</p>
        <p><pre>${JSON.stringify(params, null, '  ')}</pre></p>
      `});
      return compileUnMountMethod(location);
    }
  }, {
    pattern: /^\/router\/user\/([^\/?#]+)\/([^\/?#]+)$/i,
    handler: ({ location }) => {
      initView({ location, title: 'Regexp', content: `
        <p>Regexp pattern matching on <code>/^\/router\/user\/([^\/?#]+)\/([^\/?#]+)$/i</code></p>
      ` });
      return compileUnMountMethod(location);
    }
  },{
    pattern: '/deferred',
    handler: ({ location }) => {
      initView({ location, title: 'Deferred mounting', content: `
        <p>Only mounts when the <code>resolve</code> attribute (a promise) is resolved.</p>
        <p>Can be useful when you have to make sure to something will be available (like a user logged, some API initialized ...)</p>
        <p>This one resolves after <strong>4 seconds</strong>. Once it's resolved, it will mount immediately.</p>
      ` });
      return compileUnMountMethod(location);
    },
    resolve: new Promise(res => {
      return setTimeout(res, 4000);
    })
  }, {
    pattern: '*',
    handler: ({ location }) => {
      initView({ location, title: '404', content: `Capture all, thanks to <code>*</code>` });
      return compileUnMountMethod(location);
    }
  }
]

LiteRouter(routes);
