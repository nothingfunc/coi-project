// fis dev
fis
  .set('project.ignore', [
    'node_modules/**',
    '.idea/**',
    '.git/**',
    'fis-conf.js'
  ])
  .hook('relative')
  .match('**', {
    relative: true,
    useHash: false
  })
  .match('/components/**.js', {
    isMod: true,
    release: '$0',
    domain: '.'
  })
  .match('/src/(**)', {
    release: '$1'
  })
  .match('/src/js/**.js', {
    parser: fis.plugin('es6-babel', {
      optional: ["es7.classProperties"]
    }),
    isMod: true,
    rExt: '.js',
    domain: '.'
  })
  .hook('amd', {
    packages: [
      {
        name: 'components',
        location: '/src/js/components',
        main: 'index.js'
      }
    ]
  })
  .match('::package', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
      resourceType: 'amd',
      useInlineMap: true // 资源映射表内嵌
    })
  })
  .match('**.less', {
    parser: fis.plugin('less'), //启用fis-parser-less插件
    rExt: '.css',
    postprocessor: fis.plugin('autoprefixer', {
      browsers: [
        "last 4 versions"
      ]
    })
  });

var prod = fisMedia = function(fisMedia) {
  return fisMedia
    .match('::package', {
      // 关于打包配置，请参考：https://github.com/fex-team/fis3-packager-deps-pack
      packager: fis.plugin('deps-pack', {
        // 框架css
        '/pkg/boot.css': [
          //'/src/css/**'
        ],
        // 业务CSS
        '/pkg/app.css': [
          '/src/css/**'
        ],
        // 框架JS
        '/pkg/boot.js': [
          '/components/angular/**.js',
          //'/components/react/react.js',
          //'/components/react-dom/react-dom.js',
          //'/components/ngReact/ngReact.js'
        ],
        // 插件和库js
        '/pkg/lib.js': [
          '/components/jquery/**.js',
          '/components/angular-ui-bootstrap/**.js',
          '/components/angular-ui-router/**.js'
        ],
        // 业务逻辑打包，如果需要，在这里单独配置
        '/pkg/app.js': [
          '/src/js/**.js'
        ]
      })
    })

    .match('*.{js,jsx,es6}', {
      optimizer: fis.plugin('uglify-js')
    })

    .match('*.{css,less}', {
      optimizer: fis.plugin('clean-css'),
    })

    .match('*.png', {
      optimizer: fis.plugin('png-compressor')
    })
    .match('*.{less,css,js}', {
      useHash: true
    })
    .match('::image', {
      useHash: true
    })
};

prod(fis.media('prod'));


var DEPLOY_TO = '../dist';
prod(fis.media('deploy'))
  .match('**', {
    deploy: [
      fis.plugin('local-deliver', {
        to: DEPLOY_TO
      }),
      function() {
        //打包好的替换相当路径
        var rootHtmlPath = DEPLOY_TO + "/index.html";
        var content = new fis.file(rootHtmlPath).getContent();
        content = content.replace(/"\/pkg/g, "\"./pkg");
        fis.util.write(rootHtmlPath, content);
      }
    ]}
  )
