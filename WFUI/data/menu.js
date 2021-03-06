﻿var menu = {
    label: 'WFUI',
    data: [
        {
            label: 'GetStarted',
            name: '开始使用'            
        }, {
            label: 'Basic',
            name: '基础组件',
            data: [
                {
                    label: 'Button',
                    name: '按钮'
                }, {
                    label: 'Icon',
                    name: '图标'
                }
            ]
        }, {
            label: 'Layout',
            name: '布局',
            data: [                
                {
                    label: 'Grid',
                    name: '栅格'
                }
            ]
        }, {
            label: 'Navigation',
            name: '导航组件',
            data: [
                {
                    label: 'Breadcrumb',
                    name: '面包屑'
                }, {
                    label: 'Menu',
                    name: '导航菜单'
                }, {
                    label: 'Tab',
                    name: '标签页'
                }, {
                    label: 'Pagination',
                    name: '分页'
                }, {
                    label: 'Step',
                    name: '步骤条'
                }
            ]
        }, {
            label: 'Form control',
            name: '表单组件',
            data: [
                {
                    label: 'Checkbox',
                    name: '多选框'
                },
                //{
                //    label: 'Form',
                //    name: '表单'
                //}, 
                {
                    label: 'input',
                    name: '输入框'
                }, {
                    label: 'Radio',
                    name: '单选框'
                }, {
                    label: 'Select',
                    name: '选择器'
                }
            ]
        }, {
            label: 'Feedback',
            name: '反馈组件',
            data: [
                {
                    label: 'Alert',
                    name:'警告提示'
                }, {
                    label: 'Modal',
                    name:'对话框'
                }
            ]
        }
    ]
};
module.exports = menu;