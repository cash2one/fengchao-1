/**
 * ESUI (Enterprise Simple UI)
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @ignore
 * @file DOM事件相关辅助方法
 * @author otakustay
 */
// MARK 这个文件主要是用来做事件代理的。
// 比如在 控件里的某个元素的某种事件 触发后，会触发 控件 的对应的 newType事件。
// 还有，在全局的 window、body等元素上出发某种事件后， 在这个控件上触发对应的 newType 事件
define(
    function (require) {
        var DOM_EVENTS_KEY = '_esuiDOMEvent';
        // MARK 这里存储的应该是下面这样子的
        // globalEvents = {
        //     window: {
        //         click: [control1, control2 ..]
        //     }
        // }
        var globalEvents = {
            window: {},
            document: {},
            documentElement: {},
            body: {}
        };

        var u = require('underscore');
        var EventQueue = require('mini-event/EventQueue');
        var lib = require('../lib');

        /**
         * @override Helper
         */
        var helper = {};

        function getGlobalEventPool(element) {
            if (element === window) {
                return globalEvents.window;
            }
            if (element === document) {
                return globalEvents.document;
            }
            if (element === document.documentElement) {
                return globalEvents.documentElement;
            }
            if (element === document.body) {
                return globalEvents.body;
            }

            return null;
        }

        function triggerGlobalDOMEvent(element, e) {
            var pool = getGlobalEventPool(element);
            if (!pool) {
                return;
            }

            var queue = pool[e.type];

            if (!queue) {
                return;
            }

            u.each(
                queue,
                function (control) {
                    if (control) {
                        triggerDOMEvent(control, element, e);
                    }
                }
            );
        }

        // 事件模块专用，无通用性
        function debounce(fn, interval) {
            interval = interval || 150;

            var timer = 0;

            return function (e) {
                clearTimeout(timer);
                var self = this;
                e = e || window.event;
                e = {
                    type: e.type,
                    srcElement: e.srcElement,
                    target: e.target,
                    currentTarget: e.currentTarget
                };
                timer = setTimeout(
                    function () { fn.call(self, e); },
                    interval
                );
            };
        }

        function addGlobalDOMEvent(control, type, element) {
            var pool = getGlobalEventPool(element);

            if (!pool) {
                return false;
            }

            var controls = pool[type];
            if (!controls) {
                controls = pool[type] = [];
                var handler = u.partial(triggerGlobalDOMEvent, element);
                if (type === 'resize' || type === 'scroll') {
                    handler = debounce(handler);
                }
                controls.handler = handler;
                lib.on(element, type, controls.handler);
            }

            if (u.indexOf(controls, control) >= 0) {
                return;
            }

            controls.push(control);
            return true;
        }

        function removeGlobalDOMEvent(control, type, element) {
            var pool = getGlobalEventPool(element);

            if (!pool) {
                return false;
            }

            if (!pool[type]) {
                return true;
            }

            var controls = pool[type];
            for (var i = 0; i < controls.length; i++) {
                if (controls[i] === control) {
                    controls[i] = null;
                    break;
                }
            }
            // MARK
            // 尽早移除事件
            var isQueueEmpty = u.all(
                controls,
                function (control) {
                    return control == null;
                }
            );
            if (isQueueEmpty) {
                var handler = controls.handler;
                lib.un(element, type, handler);
                pool[type] = null;
            }

            return true;
        }

        // MARK control控件，element 元素(可能是window), e事件对象
        function triggerDOMEvent(control, element, e) {
            e = e || window.event;

            // 每个控件都能在某些状态下不处理DOM事件
            var isInIgnoringState = u.any(
                control.ignoreStates,
                function (state) {
                    return control.hasState(state);
                }
            );
            if (isInIgnoringState) {
                return;
            }

            if (!e.target) {
                e.target = e.srcElement;
            }
            if (!e.currentTarget) {
                e.currentTarget = element;
            }
            if (!e.preventDefault) {
                e.preventDefault = function () {
                    e.returnValue = false;
                };
            }
            if (!e.stopPropagation) {
                e.stopPropagation = function () {
                    e.cancelBubble = true;
                };
            }
            // MARK 这里的数据结构是怎么样子的?
            var queue =
                control.domEvents[e.currentTarget[DOM_EVENTS_KEY]][e.type];

            if (!queue) {
                return;
            }

            queue.execute(e, control);
        }

        /**
         * 为控件管理的DOM元素添加DOM事件
         *
         * 通过本方法添加的DOM事件处理函数，会进行以下额外的处理：
         *
         * - 修正`target`和`currentTarget`属性使其保持与标准兼容
         * - 修正`preventDefault`和`stopPropagation`方法使其保持与标准兼容
         * - 函数中的`this`对象永远指向当前控件实例
         * - 当控件处于由其{@link Control#ignoreStates}属性定义的状态时，不执行函数
         *
         * @param {HTMLElement | string} element 需要添加事件的DOM元素或部件名称
         * @param {string} type 事件的类型
         * @param {Function} handler 事件处理函数
         */
        helper.addDOMEvent = function (element, type, handler) {
            if (typeof element === 'string') {
                element = this.getPart(element);
            }

            if (!this.control.domEvents) {
                this.control.domEvents = {};
            }

            var guid = element[DOM_EVENTS_KEY];
            if (!guid) {
                guid = element[DOM_EVENTS_KEY] = lib.getGUID();
            }

            var events = this.control.domEvents[guid];
            if (!events) {
                // `events`中的键都是事件的名称，仅`element`除外，
                // 因为DOM上没有`element`这个事件，所以这里占用一下没关系
                events = this.control.domEvents[guid] = { element: element };
            }

            var isGlobal = addGlobalDOMEvent(this.control, type, element);
            var queue = events[type];
            if (!queue) {
                queue = events[type] = new EventQueue();
                // 非全局事件是需要自己管理一个处理函数的，以便到时候解除事件绑定
                if (!isGlobal) {
                    // 无论注册多少个处理函数，其实在DOM元素上只有一个函数，
                    // 这个函数负责执行队列中的所有函数，
                    // 这样能保证执行的顺序，移除注册时也很方便
                    // MARK 这里是怎么回事: 
                    // - queue.hander 主要是为了保存一个对这个统一处理函数的引用，方便取消事件(和jQuery的事件处理相同)
                    queue.handler =
                        u.partial(triggerDOMEvent, this.control, element);
                    lib.on(element, type, queue.handler);
                }
            }

            // MARK 在这里
            queue.add(handler);
        };

        /**
         * 代理DOM元素的事件为自身的事件
         *
         * @param {HTMLElement | string} element 需要添加事件的DOM元素或部件名称
         * @param {string} type 需要代理的DOM事件类型
         * @param {string} [newType] 代理时触发的事件，默认与`type`一致
         */
        // MARK 这里主要是用来 自定义 控件的事件的：
        // 当 控件内的某个元素的 type 事件出发后，会触发这个控件的 newType 类型 的事件。
        // 控件的 newType 事件的handler 应该是写在 对应的业务逻辑里。
        helper.delegateDOMEvent = function (element, type, newType) {
            var handler = function (e) {
                var event = require('mini-event').fromDOMEvent(e);
                // 这里的 this 指向 control ， 可以查看 triggerDOMEvent 的算法
                this.fire(newType || e.type, event);

                if (event.isDefaultPrevented()) {
                    lib.event.preventDefault(e);
                }

                if (event.isPropagationStopped()) {
                    lib.event.stopPropagation(e);
                }
            };

            this.addDOMEvent(element, type, handler);
        };

        /**
         * 为控件管理的DOM元素移除DOM事件
         *
         * @param {HTMLElement | string} element 需要添加事件的DOM元素或部件名称
         * @param {string} type 事件的类型
         * @param {Function} [handler] 事件处理函数，不提供则清除所有处理函数
         */
        // MARK 这个函数里怎么没有调用 lib.un(element, type, queue.handler) 来移除元素上绑定的事件处理函数
        // (当eventQueue为空的时候，应该需要移除的)
        // 事件的完全移除 放在  clearDOMEvents 方法里实现了。
        helper.removeDOMEvent = function (element, type, handler) {
            if (typeof element === 'string') {
                element = this.getPart(element);
            }

            if (!this.control.domEvents) {
                return;
            }

            var guid = element[DOM_EVENTS_KEY];
            var events = this.control.domEvents[guid];

            if (!events || !events[type]) {
                return;
            }

            if (!handler) {
                events[type].clear();
            }
            else {
                var queue = events[type];
                queue.remove(handler);

                // 全局元素上的事件很容易冒泡到后执行，
                // 在上面的又都是`mousemove`这种不停执行的，
                // 因此对全局事件做一下处理，尽早移除
                if (!queue.getLength()) {
                    removeGlobalDOMEvent(this.control, type, element);
                }
            }
        };

        /**
         * 清除控件管理的DOM元素上的事件
         *
         * @param {HTMLElement | string} [element] 控件管理的DOM元素或部件名称，
         * 如不提供则去除所有该控件管理的元素的DOM事件
         */
        helper.clearDOMEvents = function (element) {
            if (typeof element === 'string') {
                element = this.getPart(element);
            }

            if (!this.control.domEvents) {
                return;
            }

            if (!element) {
                // 在循环中直接删除一个属性不知道会发生什么（已知浏览器看上去没问题），
                // 因此先拿到所有的元素然后再做遍历更安全，虽然是2次循环但能有多少个对象
                u.each(
                    u.pluck(this.control.domEvents, 'element'),
                    this.clearDOMEvents,
                    this
                );
                this.control.domEvents = null;
                return;
            }

            var guid = element[DOM_EVENTS_KEY];
            var events = this.control.domEvents[guid];

            // `events`中存放着各事件类型，只有`element`属性是一个DOM对象，
            // 因此要删除`element`这个键，
            // 以避免`for... in`的时候碰到一个不是数组类型的值
            delete events.element;
            u.each(
                events,
                function (queue, type) {
                    // 全局事件只要清掉在`globalEvents`那边的注册关系
                    var isGlobal =
                        removeGlobalDOMEvent(this.control, type, element);
                    if (!isGlobal) {
                        var handler = queue.handler;
                        queue.dispose();
                        queue.handler = null; // 防内存泄露
                        lib.un(element, type, handler);
                    }
                },
                this
            );

            delete this.control.domEvents[guid];
        };

        return helper;
    }
);
