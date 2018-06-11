(function(undefined){

    d3.svg.mapModel = function(d3Polygon){
        "use strict";

        var validEvents = ["change", "slide"];

        var range = [0, 100], svg, projection, path, color, legendText,
            populationRange = [5, 30],
            ageRange = [1, 100],
            value = 0,
            margin = {top: 5, bottom: 5, right: 5, left:12},
            height = 500,
            width = 960,
            populationSize = 100,
            hulls = [],
            ages = [],
            circleData = [],
            statesOccupied = Array.apply(null, {length: 50}).map(Function.call, function(){ return Math.floor(Math.random() * (populationRange[1] - populationRange[0] + 1) + populationRange[0]); }); //Math.floor(Math.random()*(max-min+1)+min);

        var eventListeners = {
            "slide" : [],
            "change": []
        };


        function model(selection) {
            selection.each(function(){

                var g = d3.select(this);
                
                // D3 Projection
                projection = d3.geo.albersUsa()
                                   .translate([width/2, height/2])    // translate to center of screen
                                   .scale([1000]);          // scale things down so see entire US
                        
                // Define path generator
                path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
                             .projection(projection);  // tell path generator to use albersUsa projection

                        
                // Define linear scale for output
                color = d3.scale.linear()
                              .range([255,50]);

                legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];

                //Create SVG element and append map to the SVG
                svg = g.append("svg")
                            .attr("width", width)
                            .attr("height", height);
                        
                // Append Div for tooltip to SVG
                var div = g.append("div")   
                            .attr("class", "tooltip")               
                            .style("opacity", 0);

                color.domain([ageRange[0],ageRange[1]]); // setting the range of the input data

                
               // console.log(statesOccupied);

                // Load GeoJSON data and merge with states data
                d3.json("data/us-states.json", function(json) {
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

                    for(var k = 0; k < json.features.length; k++){
                        hulls.push(d3Polygon.polygonHull(json.features[k].geometry.coordinates[0]))
                    }

                    

                        // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks" 
                        // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
                        // .on("mouseover", function(d) {      
                        //     div.transition()        
                        //        .duration(200)      
                        //        .style("opacity", .9);      
                        //        div.text(d.place)
                        //        .style("left", (d3.event.pageX) + "px")     
                        //        .style("top", (d3.event.pageY - 28) + "px");    
                        // })   

                        // // fade out tooltip on mouse out               
                        // .on("mouseout", function(d) {       
                        //     div.transition()        
                        //        .duration(500)      
                        //        .style("opacity", 0);   
                        // });

                });

            
            });
        }

        model.on = function(event, listener) {
            if(!event || !arrayContains(validEvents, event)){
                throw new Error(event + " is not a valid range slider event. It should be one of " + validEvents);
            }
            eventListeners[event].push(listener);
            return model;
        }

        model.populationRange = function(x){
            if(!arguments.length) {return populationRange;}
            populationRange = x;
            return model;
        }

        model.population = function(x,y,z){
            if(!arguments.length) {return [statesOccupied,circleData,ages];}
            statesOccupied = x;
            circleData = y;
            ages = z
            model.redrawPopulation();
            return model;
        }

        model.redrawPopulation = function(){
            svg.selectAll("circle").remove();                    

            svg.selectAll("circle")
                .data(circleData)
                .enter()
                .append("circle")
                .attr('class','population-circles')
                .attr("cx", function(d) {
                    return projection([d[0], d[1]])[0];
                })
                .attr("cy", function(d) {
                    return projection([d[0], d[1]])[1];
                })
                .attr("r", function(d) {
                    return Math.sqrt(1) * 4;
                })
                .style("fill", function(d,i){
                    //return "rgb(" + Math.round(color(ages[i])) + ",0,0)";
                    return "rgb(75,75,75)";
                })  
                .style("opacity", 0.85) 
            return model;
        }

        model.setAge = function(x){
            if(arguments.length) {
                ageRange = x;
                ages = []            
                for (var i = 0; i<statesOccupied.length; i++) {
                    var dataValue = statesOccupied[i];
                    //generate random ages
                    var temp = Array.apply(null, {length: dataValue}).map(Function.call, function(){ return Math.floor(Math.random() * (ageRange[1] - ageRange[0] + 1) + ageRange[0]); });
                    ages.push.apply(ages, temp);
                }
                var type = parseInt($('#population-age-type').find(":selected").val());
                if(type == 2){
                    type = Math.floor(Math.random() * (4 - 2 + 1) + 2);
                    console.log(type);
                }
                for(i = 0; i < ages.length; i++){
                    switch(type){
                        case 1: //uniform
                            break;
                        case 2: //left
                            ages[i] = (ages[i] >= ageRange[1]/2) ? ((Math.round(Math.random()) == 0) ? Math.round(ages[i]/(Math.floor(Math.random() * (5 - 2 + 1) + 2))) : ages[i]) : ages[i];
                            break;
                        case 3: //right
                            var temp = (ages[i] <= ageRange[1]/2) ? ((Math.round(Math.random()) == 0) ? Math.round(ages[i]*(Math.floor(Math.random() * (3 - 2 + 1) + 2))) : ages[i]) : ages[i];
                            if(temp <= ageRange[1]){
                                ages[i] = temp
                            }
                            break;
                        case 4: //skewed both
                            if(Math.round(Math.random()) == 0){
                                //left
                                ages[i] = (ages[i] >= ageRange[1]/2) ? ((Math.round(Math.random()) == 0) ? Math.round(ages[i]/(Math.floor(Math.random()  * (5 - 2 + 1) + 2))) : ages[i]) : ages[i];
                            }
                            else{
                                //right
                                var temp = (ages[i] <= ageRange[1]/2) ? ((Math.round(Math.random()) == 0) ? Math.round(ages[i]*(Math.floor(Math.random() * (3 - 2 + 1) + 2))) : ages[i]) : ages[i];
                                if(temp <= ageRange[1]){
                                    ages[i] = temp
                                }
                            }
                            break;
                    }
                }
                color.domain([ageRange[0],ageRange[1]]); 
            }
            
            svg.selectAll("circle").remove();                    

            svg.selectAll("circle")
                .data(circleData)
                .enter()
                .append("circle")
                .attr('class','population-circles')
                .attr("cx", function(d) {
                    return projection([d[0], d[1]])[0];
                })
                .attr("cy", function(d) {
                    return projection([d[0], d[1]])[1];
                })
                .attr("r", function(d) {
                    return Math.sqrt(1) * 4;
                })
                .style("fill", function(d,i){
                    return "rgb(" + Math.round(color(ages[i])) + ",0,0)";
                })  
                .style("opacity", 0.85) 
            return model;
        }

        model.height = function(x){
            if(!arguments.length) {return height;}
            height = x;
            return model;
        }

        model.width = function(x){
            if(!arguments.length) {return width;}
            width = x;
            return model;
        }

        model.drawPopulation = function (x){
            if(arguments.length) {
                populationRange = x;
            }
            
            statesOccupied = Array.apply(null, {length: 50}).map(Function.call, function(){ return Math.floor(Math.random() * (populationRange[1] - populationRange[0] + 1) + populationRange[0]); });
            circleData = [];
            ages = [];
            for (var i = 0; i<statesOccupied.length; i++) {
                if(!hulls[i])
                    continue;
                var dataValue = statesOccupied[i];
                var centroid = d3Polygon.polygonCentroid(hulls[i])

                //generate random ages
                var temp = Array.apply(null, {length: dataValue}).map(Function.call, function(){ return Math.floor(Math.random() * 100 + 1); });
                ages.push.apply(ages, temp);
            
                //for n points
                var count = 0;
                while(count != dataValue){
                    var dx = Math.random() * 4 + 0,
                        dy = Math.random() * 4 + 0;
                    dx = dx * ((Math.round(Math.random()))==1?-1: 1);
                    dy = dy * ((Math.round(Math.random()))==1?-1: 1);
                    var point = [centroid[0]+dx,centroid[1]+dy];
                    if(d3Polygon.polygonContains(hulls[i],point)){
                        count += 1;
                        circleData.push(point);
                    }
                }
            }

            svg.selectAll("circle").remove();                    

            svg.selectAll("circle")
                .data(circleData)
                .enter()
                .append("circle")
                .attr('class','population-circles')
                .attr("cx", function(d) {
                //    console.log(d[0] + ',' + d[1]);
                 //   console.log(projection([d[0], d[1]]));
                    return projection([d[0], d[1]])[0];
                })
                .attr("cy", function(d) {
                    return projection([d[0], d[1]])[1];
                })
                .attr("r", function(d) {
                    return Math.sqrt(1) * 4;
                })
                .style("fill", function(d,i){
                    return "rgb(75,75,75)";   
                    //return d3.hsl(Math.round(color(ages[i])), 0.5, 0.5);
                })    
                .style("opacity", 0.85) 
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