const fs = require('fs')
const Promise = require('bluebird')

const Logger = require('../util/logger')

const dbName = 'sites'
const defaultServiceName = 'site-service'
const defaultServicePort = '4010'
const defaultMongoUri = 'mongodb://localhost:27017'
const defaultJaegerAgentHost = 'localhost'
const defaultJaegerAgentPort = '6832'
const defaultJaegerLogSpans = 'false'

class ConfigProvider {
  constructor (options) {
    options = options || {}
    this.logger = options.logger || new Logger('ConfigProvider')
  }

  _getValue (name, defaultValue) {
    let value = process.env[name]
    if (value) {
      return value
    }

    const filepath = process.env[name + '_FILE']
    if (filepath) {
      value = fs.readFileSync(filepath)
      if (value) {
        return value.toString()
      }
    }

    return defaultValue
  }

  getConfig () {
    const config = {
      serviceName: this._getValue('SERVICE_NAME', defaultServiceName),
      servicePort: parseInt(this._getValue('SERVICE_PORT', defaultServicePort)),
      mongoUri: this._getValue('MONGO_URI', defaultMongoUri) + `/${dbName}`,
      mongoUsername: this._getValue('MONGO_USERNAME'),
      mongoPassword: this._getValue('MONGO_PASSWORD'),
      jaegerAgentHost: this._getValue('JAEGER_AGENT_HOST', defaultJaegerAgentHost),
      jaegerAgentPort: parseInt(this._getValue('JAEGER_AGENT_PORT', defaultJaegerAgentPort)),
      jaegerLogSpans: this._getValue('JAEGER_LOG_SPANS', defaultJaegerLogSpans) === 'true'
    }

    return Promise.resolve(config)
  }
}

module.exports = ConfigProvider
