'use strict';
(function (global) {
    
    /**
     * wf module framework.
     * @module wf
     * @base wf
     * @alias f
     */

    var wf = global.wf || {},
    
        wf = function () {
            
            var name = 'wf',
                /**
                 * 核心模块,dependencies
                 */
                core = {
                    token: '_core_',
                    values: [
                        'logger'
                    ]
                },
                /**
                 * private
                 * 模块集合
                 */
                modules = {};
            
            /**
             * WFUI实例
             */
            return {
                
                /**
                 * 模块名称
                 * @property {String} name
                 */
                name: 'wf', 
                
                /**
                 * 版本号,项目构建新版本时更新发布版本号
                 * @property {String} version
                 */
                version: '1.0.0',
                
                /**
                 * 模块声明
                 * @method define
                 * @param {String} name 模块名称
                 * @param {Array||String} dependencies 模块依赖项,为core.token时引用核心模块
                 * @param {String} factory 模块创建工厂
                 * @return {Module} 返回该定义模块
                 */
                define: function (name, dependencies, factory) {
                    
                    if (typeof dependencies === 'string' && dependencies === core.token) {
                        dependencies = core.values;
                    }
                    
                    if (!modules[name]) {
                        var module = {
                            name: name,
                            dependencies: dependencies,
                            factory: factory
                        };
                        
                        modules[name] = module;
                    }
                    
                    return modules[name];
                },
                
                /**
                 * 模块引用
                 * @method require
                 * @param {String} name 模块名称
                 * @return {Object} 返回该定义模块的实例
                 */
                require: function (name) {
                    
                    var module = modules[name];
                    
                    if (!module.entity) {
                        var args = [];
                        for (var i = 0; i < module.dependencies.length; i++) {
                            if (modules[module.dependencies[i]].entity) {
                                args.push(modules[module.dependencies[i]].entity);
                            }
                            else {
                                args.push(this.require(module.dependencies[i]));
                            }
                        }
                        
                        module.entity = module.factory.apply(function () { 
                            //noop
                        }, args);
                    }
                    return module.entity;
                },
                
                /**
                 * 模块继承
                 * @method inherit
                 * @param {String} base 父类
                 * @return {Class} 返回该定义的类型
                 */
                inherit: function (base, prop) {
                    
                    /**
                     * 正则匹配函数参数
                     * private
                     * @method argumentNames
                     * @param {Function} fn 函数
                     * @return {Array}names 参数名数组
                     */
                    var argumentNames = function (fn) {
                        var names = fn.toString().match(/^[\s\(]*function[^(]*\(([^\)]*)\)/)[1].replace(/\s+/g, '').split(',');
                        return names.length == 1 && !names[0] ? [] : names;
                    }
                    
                    // 本次调用所创建的类（构造函数）
                    function C() {
                        
                        if (base) {
                            this.baseprototype = base.prototype;
                        }
                        if (!this.init) {
                            throw new Error('init function is undefind');
                        }
                        this.init.apply(this, arguments);
                    }
                    
                    // 单参数情况下 - inherit(prop)
                    if (typeof (base) === 'object') {
                        prop = base;
                        base = null;

                    }
                    
                    if (base) {
                        var MiddleClass = function () { };
                        MiddleClass.prototype = base.prototype;
                        C.prototype = new MiddleClass();
                        C.prototype.constructor = C;
                    }
                    
                    /**
                     * 重写父类方法,特殊情况下使用_base_访问父类同名方法（必须为第一个参数）
                     */
                    for (var name in prop) {
                        if (prop.hasOwnProperty(name)) {
                            if (base && typeof (prop[name]) === 'function' && argumentNames(prop[name])[0] === '_base_') {
                                C.prototype[name] = (function (name, fn) {
                                    return function () {
                                        var that = this,
                                            _base_ = function () {
                                                return base.prototype[name].apply(that, arguments);
                                            };
                                        return fn.apply(this, Array.prototype.concat.apply(_base_, arguments));
                                    };
                                })(name, prop[name]);
                        
                            } else {
                                C.prototype[name] = prop[name];
                            }
                        }
                    }
                    
                    return C;
                }
            };
        };
    
    global.wf = wf();

})(window);

'use strict';
/**
 * 扩展String format.
 */
(function () {
    
    String.prototype.format = function () {
        var source = this;
        if (arguments.length > 0) {
            $.each(arguments, function (i, n) {
                source = source.replace(new RegExp('\\{' + i + '\\}', 'g'), n);
            });
        }
        return source;
    };

    String.prototype.empty = function () {
        return '';
    };
    Array.prototype.empty = function () {
        return [];
    };
    Function.prototype.empty = function () { 
        return function () { };
    };
    Object.prototype.empty = function () { 
        return {};
    };
})();
'use strict';

(function (global) {
    /**
     * 兼容console
     */
    var _console = global.console || {},

        methods = [
            'assert',
            'clear',
            'count',
            'debug',
            'dir',
            'dirxml',
            'exception',
            'error',
            'group',
            'groupCollapsed',
            'groupEnd',
            'info',
            'log',
            'profile',
            'profileEnd',
            'table',
            'time',
            'timeEnd',
            'timeStamp',
            'trace',
            'warn'
        ],
        console = {
            version: '1.0.0'
        },
        key;

    for (var i = 0, len = methods.length; i < len; i++) {
        key = methods[i];
        console[key] = function (key) {
            return function () {
                if (typeof _console[key] === 'undefined') {
                    return 0;
                }

                Function.prototype.apply.call(_console[key], _console, arguments);
            };
        }(key);
    }

    global.console = console;

}(window));
'use strict';

wf.define('logger', [], function () {

    /**
     * private
     * 日志级别
     */
    var LogLevel = {
        debug: 'debug',
        info: 'info',
        warn: 'warn',
        error: 'error'
    },

    /**
     * private
     * 日志输出模式
     */
    Mode = {
        local: 'local',
        remote: 'remote'
    },

    /**
     * private
     * 日志默认输出到本地
     */
    mode = Mode.local,

    /**
     * private
     * 日志输出到远程的地址
     */
    remoteUrl = '',

    /**
     * 日志输出
     * private
     * @method output
     * @param {String} msg 日志消息
     * @param {LogLevel} level 日志级别
     */
    output = function (msg, level) {
        if (mode = Mode.local) {
            console[level](msg);
        } else {
            if (!remoteUrl) {
                throw new Error('remoteUrl empty,');
            } else {
                //TODO 远程日志服务
            }
        }
        return msg;
    };

    /**
     * public api
     */
    return {

        /**
         * 获取日志输出模式
         * @method getOutputMode
         * @return {String} mode
         */
        getOutputMode: function () {
            return mode;
        },

        /**
         * 设置日志输出模式,仅当url有值时使用Mode.remote
         * @method setOutputMode
         * @param {String} url 远程日志系统url
         */
        setOutputMode: function (url) {
            if (url) {
                remoteUrl = url;
                mode = Mode.remote;
            }
        },

        /**
         * debug模式,调试时输出
         * @method debug
         * @param {String} msg 日志消息
         * @return {String} 返回该消息
         */
        debug: function (msg) {
            return output(msg, LogLevel.debug);
        },

        /**
         * info模式,输出到终端用户
         * @method info
         * @param {String} msg 日志消息
         * @return {Module} 返回该消息
         */
        info: function (msg) {
            return output(msg, LogLevel.info);
        },

        /**
         * warn模式,系统警告,建议远程传回
         * @method warn
         * @param {String} msg 日志消息
         * @return {Module} 返回该消息
         */
        warn: function (msg) {
            return output(msg, LogLevel.warn);
        },

        /**
         * error模式,系统错误,建议远程传回
         * @method error
         * @param {String} msg 日志消息
         * @return {Module} 返回该消息
         */
        error: function (msg) {
            return output(msg, LogLevel.error);
        }
    };
});
/*
 * cookie module
 *
 */

wf.define('cookie', [], function () {
    return {
        /**
         * 设置cookie
         * 
         * @param {String} key cookie名称
         * @param {String} value cookie值
         * @param {String} domain 所在域名
         * @param {String} path 所在路径
         * @param {String} expires 过期时间
         */
        set: function (key, value, domain, path, expires) {
            document.cookie = [
                key, '=', value,
                expires ? '; expires=' + expires.toGMTString() : '',
                path ? '; path=' + path : '',
                domain ? '; domain=' + domain : ''
            ].join('');
        },
        /**
         * 获取指定名称的cookie值
         * 
         * @param {String} key cookie名称
         * @return {String} 获取到的cookie值
         */
        get: function (key) {
            var arr, reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
            if (arr = document.cookie.match(reg))
                return arr[2];
            else
                return null;
        },
        /**
         * 删除cookie
         * 
         * @param {String} key cookie名称
         */
        remove: function (key) {
            document.cookie = key + '=; expires=Mon, 26 Jul 1997 05:00:00 GMT;';
        }
    };
});
'use strict';

wf.define('loader', [], function () {

    /**
     * private
     * 动态加载模块集合
     */
    var loadModules = {},

        /**
         * 创建模块node
         * private
         * @method createModuleNode
         * @param {String} path 模块url
         * @return {String} node
         */
        createModuleNode = function (path) {
            var node = document.createElement('script');
            node.type = 'text/javascript';
            node.async = 'true';
            node.src = path + '.js';
            return node;
        };

    /**
     * public api
     */
    return {
        
        name: 'model loader',

        /**
         * 获取日志输出模式
         * @method load 动态获取模块
         */
        load: function (pathArr, callback) {
            for (var i = 0; i < pathArr.length; i++) {

                var path = pathArr[i];

                if (!loadModules[path]) {
                    var head = document.getElementsByTagName('head')[0],
                        node = createModuleNode(path),

                    /**
                     * check所有模块加载完成执行callback
                     * @param {Function} callback 加载完成回调函数
                     * private
                     */
                    checkAllFiles = function () {
                        var allLoaded = true;

                        for (var i = 0; i < pathArr.length; i++) {
                            if (!loadModules[pathArr[i]]) {
                                allLoaded = false;
                                break;
                            }
                        }

                        if (allLoaded) {
                            callback();
                        }
                    }
                    node.onload = function () {
                        loadModules[path] = true;
                        head.removeChild(node);
                        checkAllFiles(pathArr, callback);
                    };
                    head.appendChild(node);
                }
            }

        }
    };
});
'use strict';

wf.define('UI', '_core_', function () {
    return wf.inherit({

        name: String.empty,

        $element: Object.empty,
        
        init: function (name,$element) {
            this.name = name;
            this.$element = $element;
        },

        show: function () { 
            this.$element.show();
        },

        hide: function () { 
            this.$element.hide();
        },

        remove: function () { 
            this.$element.remove();
        }

    });
});