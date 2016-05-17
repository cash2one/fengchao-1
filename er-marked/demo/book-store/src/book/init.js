define(
    function(require) {
        var actions = [
            {
                path: '/book/list',
                type: 'book/List',      // 这个对应的是 path 的处理函数
                title: '图书列表'
            },
            {
                path: '/book/view',
                type: 'book/Read',
                title: '图书详情'
            }
        ];

        var controller = require('er/controller');
        _.forEach(actions, controller.registerAction, controller);
    }
);