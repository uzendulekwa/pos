const assert = require('assert');
const pos_1 = require("../dist/controller");
const state_1 = require("../dist/state");

describe('PosController', function () {
    describe('Product Input', function(){
        var pos = new pos_1.PosController();
        var state = state_1.State;
        pos.start();
        it('should run product if uniq partial ID is provided', function(){
            pos.processInput('017');
            assert.strictEqual(state.cart.length, 1);
        });
        it('should run total when total is typed', function(){
            pos.processInput('total');
            assert.notStrictEqual(state.total, 0);
        });
    });
});
