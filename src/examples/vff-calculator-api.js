let vffCalculatorApi = {

    add         : function(a,b){
        return "VFF add result: " + (a + b);
    },
    subtract    : function(a,b){
        return "VFF subtract result: " + (a - b);
    },
    multiply    : function(a,b){
        return "VFF multiply result: " + (a * b);
    },
    divide      : function (a,b) {
        return "VFF divide result: " + (a / b);
    }

};


window.vff.extend("calc", vffCalculatorApi);