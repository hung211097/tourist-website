const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { ANALYZE } = process.env

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
  useFileSystemPublicRoutes: process.env.NODE_ENV == 'development',
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        {
          loader: 'emit-file-loader',
          options: {
            name: 'dist/[path][name].[ext]',
          },
        },
        'babel-loader',
        'styled-jsx-css-loader',
      ]
    });

    const configFileMappings = {
        'development': './configs/.env.development',
        'production': './configs/.env.production'
    }

    const { parsed: localEnv } = require('dotenv').config({path: configFileMappings[process.env.NODE_ENV]})
    config.plugins.push(
      new webpack.EnvironmentPlugin(localEnv)
    )

    
    if (ANALYZE) {
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: isServer ? 8888 : 8889,
        openAnalyzer: true
      }))
    }

    return config
  }
}
