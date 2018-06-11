(function(undefined){

    d3.svg.histogramComponent = function(){
        "use strict";

        var average = 0,
            values = [],
            binSize = 20,
            margin = {top: 20, right: 30, bottom: 50, left: 30},
            width = 600 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

        var x,y,formatCount,data,svg;

        function histo(g) {
            g.each(function(){
                var selection = d3.select(this);

                var valuesForAverage = [];
                for(var i =0; i< values.length; i++){
                    if(values[i] >= 0){
                        valuesForAverage.push(values[i]);
                    }
                }
                average = d3.mean(valuesForAverage);

                binSize = (d3.max(values) - d3.min(values)) / 5;

                if(binSize === 0)
                    binSize = 20;

                // Formatters for counts and times (converting numbers to Dates).
                formatCount = d3.format(",.0f");
                    
                x = d3.scale.linear()
                    .domain([0,100])
                    .range([0, width]);
                x.ticks(20);

                console.log(values);
                console.log(binSize);
                // Generate a histogram using twenty uniformly-spaced bins.
                data = d3.layout.histogram()
                    .bins(binSize)
                    (values);

                console.log(data);

                y = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) { return d.y; })])
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .tickFormat(formatCount);

                //$("#distribution-display").empty();
                selection.empty();
                svg = selection.append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var bar = svg.selectAll(".bar")
                    .data(data)
                    .enter().append("g")
                    .attr("class", "bar")
                    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

                bar.append("rect")
                    .attr("x", 1)
                    .attr("width", (data[0].dx == 0) ? x(5) : x(data[0].dx) - 1)
                    .attr("height", function(d) { return height - y(d.y); });

                bar.append("text")
                    .attr("dy", ".75em")
                    .attr("y", 6)
                    .attr("x", x(data[0].dx) / 2)
                    .attr("text-anchor", "middle")
                    .text(function(d) { return (d.y); });

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis); 

                var averageBlock = svg.append('g');

                averageBlock.append('line')
                    .attr('x1', x(average))
                    .attr('y1', 0)
                    .attr('x2',x(average))
                    .attr('y2',y(0) + 20)
                    .attr('stroke','red')
                    .attr('stroke-width',3);

                averageBlock.append("text")
                    .attr("dy", "1em")
                    .attr("y", y(0) + 22)
                    .attr("x", x(average))
                    .attr("text-anchor", "middle")
                    .style("font-size", "18px")
                    .text(function() { return  "Mean: " + Math.round(average * 10) / 10 ;});
               
            });
        }

        histo.takeSample = function(x) {
            if(!arguments.length) {return values;}
            var sampleSize = x;
            var sample = getRandom(values,sampleSize);
            return sample;
        }

        histo.values = function(x){
            if(!arguments.length) {return values;}
            values = x;
            return histo;
        }

        histo.height = function(x){
            if(!arguments.length) {return height;}
            height = x;
            return histo;
        }

        histo.width = function(x){
            if(!arguments.length) {return width;}
            width = x;
            return histo;
        }

        return histo;
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


    function getRandom(arr, n) {
        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len;
        }
        return result;
    }
})(undefined);