﻿QUnit.test('wf base', function (assert) {
    wf.define('constant.PI', [], function () {
        return 3.14159;
    });
    
    wf.define('shape.Circle', ['constant.PI'], function (pi) {
        var Circle = function (r) {
            this.r = r;
        };
        
        Circle.prototype = {
            area : function () {
                return pi * this.r * this.r;
            }
        }
        
        return Circle;
    });
    
    wf.define('shape.Rectangle', [], function () {
        var Rectangle = function (l, w) {
            this.l = l;
            this.w = w;
        };
        
        Rectangle.prototype = {
            area: function () {
                return this.l * this.w;
            }
        };
        
        return Rectangle;
    });
    
    wf.define('ShapeTypes', ['shape.Circle', 'shape.Rectangle'], function (Circle, Rectangle) {
        return {
            CIRCLE: Circle,
            RECTANGLE: Rectangle
        };
    });
    
    wf.define('ShapeFactory', ['ShapeTypes'], function (ShapeTypes) {
        
        return {
            getShape: function (type) {
                var shape;
                
                switch (type) {
                    case 'CIRCLE': {
                        shape = new ShapeTypes[type](arguments[1]);
                        break;
                    }
                    case 'RECTANGLE': {
                        shape = new ShapeTypes[type](arguments[1], arguments[2]);
                        break;
                    }
                }
                
                return shape;
            }
        };
    });
    var pi = wf.require('constant.PI');
    var ShapeFactory = wf.require('ShapeFactory');
    var cirlceArea = ShapeFactory.getShape('CIRCLE', 5).area();
    var rectangleArea = ShapeFactory.getShape('RECTANGLE', 3, 4).area();
    assert.equal(pi, 3.14159, "module define successed");
    assert.ok(cirlceArea == 78.53975 && rectangleArea == 12, 'module require successed');
});

QUnit.test('wf.cookie', function (assert) {
    var cookie = wf.require('cookie');
    cookie.set('testCookie', 'value');
    assert.equal(cookie.get('testCookie'), 'value', "wf.cookie");
});