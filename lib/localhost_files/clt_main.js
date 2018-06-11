define(function (require) {
    var $ = require('jquery-2.2.4.min');
    var d3 = require('d3.v3.min');
    var map1;

    require('bootstrap.min');
    require('app/model/population');

    //BLOCK: Initialize
    require(['d3-polygon'], function(d3Polygon){
        require(['component/map'], function(){
            // Map UI Initialize
            map1 = d3.svg.mapModel(d3Polygon);
            drawUIControl();
        });
    });

    


  

    //initialize UI controls

    function drawUIControl() {
        d3.select('#population-display').call(map1);
    }

    //BLOCK: Controllers and event listeners

});
