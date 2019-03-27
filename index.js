const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const join = path.join

const getRouteManager = require('umi-build-dev/lib/plugins/commands/getRouteManager').default
const getFilesGenerator = require('umi-build-dev/lib/plugins/commands/getFilesGenerator').default
const Service = require('umi-build-dev/lib/Service').default
const UserConfig = require('umi-build-dev/lib/UserConfig').default

module.exports = function (entry, pwd) {
  if (!pwd) pwd = process.cwd()

  process.env.UMI_DIR = pwd + '/node_modules/umi'

  // 初始化service
  const service = new Service({
    cwd: pwd
  })
  // service.init();

  service.loadEnv()
  service.initPlugins() // reload user config

  // 合并默认配置和用户配置
  const userConfig = new UserConfig(service)
  const config = userConfig.getConfig({ force: true })
  mergeConfig(service.config, config)
  service.userConfig = userConfig

  if (config.outputPath) {
    const paths = service.paths
    paths.outputPath = config.outputPath
    paths.absOutputPath = join(paths.cwd, config.outputPath)
  }
  service.applyPlugins('onStart')

  // 获得路由
  const RoutesManager = getRouteManager(service)
  RoutesManager.fetchRoutes()

  // console.log("service.config.mountElementId," + service.config)
  // console.dir(service.config.mountElementId)

  // 生成.umi-production里的信息
  const filesGenerator = getFilesGenerator(service, {
    RoutesManager,
    mountElementId: service.config.mountElementId
  })

  filesGenerator.generate()

  // 获取webpack配置信息
  const webpackConfig = require('umi-build-dev/lib/getWebpackConfig').default(service)

  // debug(webpackConfig)
  if (entry) {
    for (var k in entry) {
      webpackConfig.entry[k] = entry[k]
    }
  }

  // for node server-side render config
  const isDev = process.env.NODE_ENV === 'development'
  webpackConfig.mode = process.env.NODE_ENV
  webpackConfig.devtool = isDev ? 'eval-source-map' : ''
  webpackConfig.target = 'node'
  webpackConfig.externals = nodeExternals({
    whilelist: /\.(css|less|sass|scss)$/
  })
  webpackConfig.output.libraryTarget = 'commonjs2'
  webpackConfig.plugins.push(new webpack.DefinePlugin({
    __isBrowser__: false
  }))

  const compiler = webpack(webpackConfig)

  // 测试webpack执行情况
  // compiler.run((err, stats) => {/* ...处理结果 */
  // if (err) console.dir(err)

  // console.dir(stats)
  // })
  return compiler
}

// 合并配置
function mergeConfig (oldConfig, newConfig) {
  var _lodash = require('lodash')
  Object.keys(oldConfig).forEach(key => {
    if (!(key in newConfig)) {
      delete oldConfig[key]
    }
  });
  (0, _lodash.assign)(oldConfig, newConfig)
  return oldConfig
}
