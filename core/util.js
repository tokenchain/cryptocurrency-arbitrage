/**
 * Created by hesk on 2017/12/15.
 */
const moment = require('moment');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const semver = require('semver');
const program = require('commander');
const retry = require('retry');
const startTime = moment();
let _config = false;
let _package = false;
let _nodeVersion = false;
let _gekkoMode = false;
let _gekkoEnv = false;
let _args = false;
// helper functions
const util = {
    getConfig: function () {
        // cache
        if (_config)
            return _config;
        if (!program.config)
            util.die('Please specify a config file.', true);
        if (!fs.existsSync(util.dirs().gekko + program.config))
            util.die('Cannot find the specified config file.', true);
        _config = require(util.dirs().gekko + program.config);
        return _config;
    },
    // overwrite the whole config
    setConfig: function (config) {
        _config = config;
    },
    setConfigProperty: function (parent, key, value) {
        if (parent)
            _config[parent][key] = value;
        else
            _config[key] = value;
    },
    getVersion: function () {
        return util.getPackage().version;
    },
    getPackage: function () {
        if (_package)
            return _package;
        _package = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8'));
        return _package;
    },
    getRequiredNodeVersion: function () {
        return util.getPackage().engines.node;
    },
    recentNode: function () {
        const required = util.getRequiredNodeVersion();
        return semver.satisfies(process.version, required);
    },
    // check if two moments are corresponding
    // to the same time
    equals: function (a, b) {
        return !(a < b || a > b)
    },
    minToMs: function (min) {
        return min * 60 * 1000;
    },
    defer: function (fn) {
        return function (arguments) {
            let args = _.toArray(arguments);
            return _.defer(function () {
                fn.apply(this, args)
            });
        }
    },
    logVersion: function () {
        return `ARI-B version: v${util.getVersion()}`
            + `\nNode.js version: ${process.version}`;
    },
    die: function (m, soft) {
        let log;
        if (_gekkoEnv === 'standalone' || !_gekkoEnv)
            log = console.log.bind(console);
        else if (_gekkoEnv === 'child-process')
            log = m => process.send({type: 'error', error: m});

        if (m) {
            if (soft) {
                log('\n ERROR: ' + m + '\n\n');
            } else {
                log('\n\nARI-B encountered an error and can\'t continue');
                log('\nError:\n');
                log(m, '\n\n');
                log('\nMeta debug info:\n');
                log(util.logVersion());
                log('');
            }
        }
        process.exit(1);
    },
    dirs: function () {
        const ROOT = __dirname + '/../';

        return {
            gekko: ROOT,
            core: ROOT + 'core/',
            markets: ROOT + 'core/markets/',
            exchanges: ROOT + 'exchanges/',
            plugins: ROOT + 'plugins/',
            methods: ROOT + 'strategies/',
            indicators: ROOT + 'strategies/indicators/',
            budfox: ROOT + 'core/budfox/',
            importers: ROOT + 'importers/exchanges/',
            tools: ROOT + 'core/tools/',
            workers: ROOT + 'core/workers/',
            web: ROOT + 'web/',
            config: ROOT + 'config/'
        }
    },
    inherit: function (dest, source) {
        require('util').inherits(dest, source);
    },
    makeEventEmitter: function (dest) {
        util.inherit(dest, require('events').EventEmitter);
    },
    setGekkoMode: function (mode) {
        _gekkoMode = mode;
    },
    gekkoMode: function () {
        if (_gekkoMode)
            return _gekkoMode;
        if (program['import'])
            return 'importer';
        else if (program.backtest)
            return 'backtest';
        else
            return 'realtime';
    },
    gekkoModes: function () {
        return [
            'importer',
            'backtest',
            'realtime'
        ]
    },
    setGekkoEnv: function (env) {
        _gekkoEnv = env;
    },
    gekkoEnv: function () {
        return _gekkoEnv || 'standalone';
    },
    launchUI: function () {
        if (program['ui'])
            return true;
        else
            return false;
    },
    getStartTime: function () {
        return startTime;
    },
    retry: function (fn, callback) {
        const operation = retry.operation({
            retries: 5,
            factor: 1.2,
            minTimeout: 1 * 1000,
            maxTimeout: 3 * 1000
        });

        operation.attempt(function (currentAttempt) {
            fn(function (err, result) {
                if (operation.retry(err)) {
                    return;
                }
                callback(err ? operation.mainError() : null, result);
            });
        });
    }
};

// NOTE: those options are only used
// in stand alone mode
program
    .version(util.logVersion())
    .option('-c, --config <file>', 'Config file')
    .option('-b, --backtest', 'backtesting mode')
    .option('-i, --import', 'importer mode')
    .option('--ui', 'launch a web UI')
    .parse(process.argv);

// make sure the current node version is recent enough
if (!util.recentNode())
    util.die([
        'Your local version of Node.js is too old. ',
        'You have ', process.version, ' and you need atleast ',
        util.getRequiredNodeVersion()
    ].join(''), true);

module.exports = util;
