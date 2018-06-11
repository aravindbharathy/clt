(function(undefined){

    d3.svg.mapModel = function(d3Polygon){
        "use strict";

        var validEvents = ["change", "slide"];

        var range = [0, 100],
            values = [0, 100],
            margin = {top: 5, bottom: 5, right: 5, left:12},
            height = 500,
            width = 960,
            populationSize = 100,
            hulls = [],
            statesOccupied = Array.apply(null, {length: 50}).map(Number.call, Math.floor(Math.random() * ((10-1)+1) + 1));

        var eventListeners = {
            "slide" : [],
            "change": []
        };


        function model(selection) {
            selection.each(function(){

                var g = d3.select(this);
                
                // D3 Projection
                var projection = d3.geo.albersUsa()
                                   .translate([width/2, height/2])    // translate to center of screen
                                   .scale([1000]);          // scale things down so see entire US
                        
                // Define path generator
                var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
                             .projection(projection);  // tell path generator to use albersUsa projection

                        
                // Define linear scale for output
                var color = d3.scale.linear()
                              .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

                var legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];

                //Create SVG element and append map to the SVG
                var svg = g.append("svg")
                            .attr("width", width)
                            .attr("height", height);
                        
                // Append Div for tooltip to SVG
                var div = g.append("div")   
                            .attr("class", "tooltip")               
                            .style("opacity", 0);

                color.domain([0,1,2,3]); // setting the range of the input data

            
                console.log(statesOccupied);

                // Load GeoJSON data and merge with states data
                d3.json("data/us-states.json", function(json) {
                    for(var k = 0; k < json.features.length; k++){
                        hulls.push(d3Polygon.polygonHull(json.features[k].geometry.coordinates[0]))
                    }
                    
                    console.log(d3Polygon.polygonContains(hulls[3],[-119.6990509,34.4193802]))

                    // Loop through each state data and set random points
                    for (var state in statesOccupied) {
                        var dataValue = statesOccupied[state];
                    }
                            
                    // Bind the data to the SVG and create one path per GeoJSON feature
                    svg.selectAll("path")
                        .data(json.features)
                        .enter()
                        .append("path")
                        .attr("d", path)
                        .style("stroke", "#fff")
                        .style("stroke-width", "1")
                        .style("fill", function(d) {
                            return "rgb(213,222,217)";                        
                        });

                });
            });
        }

        model.on = function(event, listener) {
            if(!event || !arrayContains(validEvents, event)){
                throw new Error(event + " is not a valid range slider event. It should be one of " + validEvents);
            }
            eventListeners[event].push(listener);
            return slider;
        }

        model.range = function(x) {
            if(!arguments.length) {return range;}
            range = x;
            return slider;
        }

        model.values = function(x){
            if(!arguments.length) {return values;}
            values = x;
            displayValues = values;
            return slider;
        }

        model.displayValues = function(x){
            if(!arguments.length) {return displayValues;}
            displayValues = x;
            return slider;
        }

        model.height = function(x){
            if(!arguments.length) {return height;}
            height = x;
            return slider;
        }

        model.width = function(x){
            if(!arguments.length) {return width;}
            width = x;
            return slider;
        }

        model.colors = function(x){
            if(!arguments.length) {return colors;}
            colors = x;
            return slider;
        }

        model.tickFormat = function(_) {
            if (!arguments.length) return tickFormat;
            tickFormat = _;
            return slider;
        }

        model.tickValues = function(_) {
            if (!arguments.length) return tickValues;
            tickValues = _;
            return slider;
        }

        model.minInterval = function(_) {
            if (!arguments.length) return minInterval;
            minInterval = _;
            return slider;
        }

        model.stepSize = function(_) {
            if (!arguments.length) return stepSize;
            stepSize = _;
            return slider;
        }

        return model;
    };

    // utility functions
    /**
     * Checks if an array contains a value
     * @param  {[type]} array [description]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    function arrayContains(array, value) {
        for(var i in array){
            if (array[i] === value){
                return true;
            }
        }
        return false;
    }
})(undefined);