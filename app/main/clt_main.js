define(function (require) {
    require('jquery-2.2.4.min');
    var d3 = require('d3.v3.min');
    var map1,map2;
    var populationSlider;
    var ageSlider;
    var mainHisto;
    var sampleHisto;
    var sampleMeanHisto;
    var sampleSizeSlider;

    var currentSampleMeans = [];

    require('bootstrap.min');
    require('app/model/population');

    //BLOCK: Initialize
    require(['d3-polygon'], function(d3Polygon){
        require(['component/map'], function(){
            map1 = d3.svg.mapModel(d3Polygon);
            map2 = d3.svg.mapModel(d3Polygon);
            require(['component/slider-range'], function(){
                populationSlider = d3.svg.rangeSlider().range([5,100]).values([5,30]).minInterval(5);
                ageSlider = d3.svg.rangeSlider().range([1,100]).values([1,100]).minInterval(9); 
                
                //BLOCK: Controllers and event listeners
                populationSlider.on("change", function(event, params){
                    // At end of sliding
                    var values = populationSlider.displayValues();
                })
                .on("slide", function(event, params){
                    var values = populationSlider.displayValues();
                    $('#population-control-value-min').html(values[0]);
                    $('#population-control-value-max').html(values[1]);
                });

                ageSlider.on("change", function(event, params){
                    // At end of sliding
                    var values = ageSlider.displayValues();
                })
                .on("slide", function(event, params){
                    var values = ageSlider.displayValues();
                    $('#age-control-value-min').html(values[0]);
                    $('#age-control-value-max').html(values[1]);
                });

                $('#btn-create-population').on('click',function() {
                    var values = populationSlider.values();
                    map1.drawPopulation(values);
                    $('#btn-next-1').css('display','block');
                });

                $('#btn-create-age').on('click',function() {
                    var values = ageSlider.values();
                    map2.setAge(values);

                    $('#gradient-bar').empty();
                    var svg = d3.select('#gradient-bar').append("svg")
                        .attr("width", 400)
                        .attr("height", 30);

                    var gradient = svg.append('svg').append("defs")
                      .append("linearGradient")
                        .attr("id", "gradient");
                    
                    gradient.append("stop")
                        .attr("offset", "0%")
                        .attr("stop-color", "#640000")
                        .attr("stop-opacity", 1);

                    gradient.append("stop")
                        .attr("offset", "100%")
                        .attr("stop-color", "#ff0000")
                        .attr("stop-opacity", 1);

                    svg.append("rect")
                        .attr("width", 342)
                        .attr("height", 20)
                        .attr("transform", "translate(" + 12 + "," + 0 + ")")
                        .style("fill", "url(#gradient)");

                    $('#btn-create-histo').css('display','block');
                    $('#btn-next-2-text').css('display','block');
                    currentSampleMeans = []
                    sampleHisto.values([]);
                    sampleMeanHisto.values([]);
                    $('#sample-display').empty();
                    $('#sample-mean-display').empty();

                });

                $('#btn-next-1').on('click',function() {
                    //TODO: Scroll                    
                    var temp = map1.population();
                    map2.population(temp[0],temp[1],temp[2]);
                });

                require(['component/histogram-component'], function(){
                    require(['component/slider-single-color'], function(){
                        mainHisto = d3.svg.histogramComponent().values([]);
                        sampleHisto = d3.svg.histogramComponent().values([]);
                        sampleMeanHisto = d3.svg.histogramComponent().values([]);

                        var points = new Array(100);
                        for (var i = 0; i < 100; i++) {
                            points[i] = i + 1;
                        }

                        sampleSizeSlider = d3.svg.singleSlider().min(1).max(100).tickValues([1,10,20,30,40,50,60,70,80,90,100]).stepValues(points).value(10).width(350);
                        $('#btn-create-histo').on('click',function() {
                            //TODO: Scroll 
                            var data = map2.population();
                            data = data[2];
                            mainHisto.values(data);
                            $('#distribution-display').empty();
                            $('#sample-size-selector').empty();
                            $('#sample-plot-right').css('display','block');
                            d3.select('#distribution-display').call(mainHisto);
                            d3.select('#sample-size-selector').call(sampleSizeSlider);
                        });

                        $('#btn-take-1-sample').on('click',function() {
                            //take a sample
                            var sample = mainHisto.takeSample(sampleSizeSlider.value());
                            sampleHisto.values(sample);
                            $('#sample-display').empty();
                            d3.select('#sample-display').call(sampleHisto);

                            var sampleMean = d3.mean(sample);
                            currentSampleMeans.push(Math.round(sampleMean));
                            sampleMeanHisto.values(currentSampleMeans);
                            $('#sample-mean-display').empty();
                            d3.select('#sample-mean-display').call(sampleMeanHisto);
                            $('#sample-plot').css('display','block');
                            $('#sample-mean-plot').css('display','block');
                        });

                         $('#btn-reset-sample').on('click',function() {
                            currentSampleMeans = []
                            sampleHisto.values([]);
                            sampleMeanHisto.values([]);
                            $('#sample-display').empty();
                            $('#sample-mean-display').empty();
                         });

                        $('#btn-take-5-sample').on('click',function() {
                            //take a sample
                            for(var i = 0; i < 5; i++){
                                //take a sample
                                var sample = mainHisto.takeSample(sampleSizeSlider.value());
                                sampleHisto.values(sample);
                                $('#sample-display').empty();
                                d3.select('#sample-display').call(sampleHisto);

                                var sampleMean = d3.mean(sample);
                                currentSampleMeans.push(Math.round(sampleMean));
                                sampleMeanHisto.values(currentSampleMeans);
                                $('#sample-mean-display').empty();
                                d3.select('#sample-mean-display').call(sampleMeanHisto);
                            }
                        });

                        $('#btn-take-100-sample').on('click',function() {
                            //take a sample
                            for(var i = 0; i < 100; i++){
                                //take a sample
                                var sample = mainHisto.takeSample(sampleSizeSlider.value());
                                sampleHisto.values(sample);
                                $('#sample-display').empty();
                                d3.select('#sample-display').call(sampleHisto);

                                var sampleMean = d3.mean(sample);
                                currentSampleMeans.push(Math.round(sampleMean));
                                sampleMeanHisto.values(currentSampleMeans);
                                $('#sample-mean-display').empty();
                                d3.select('#sample-mean-display').call(sampleMeanHisto);
                            }
                        });

                        $('#btn-take-1000-sample').on('click',function() {
                            //take a sample
                            for(var i = 0; i < 1000; i++){
                                //take a sample
                                var sample = mainHisto.takeSample(sampleSizeSlider.value());
                                sampleHisto.values(sample);
                                $('#sample-display').empty();
                                d3.select('#sample-display').call(sampleHisto);

                                var sampleMean = d3.mean(sample);
                                currentSampleMeans.push(Math.round(sampleMean));
                                sampleMeanHisto.values(currentSampleMeans);
                                $('#sample-mean-display').empty();
                                d3.select('#sample-mean-display').call(sampleMeanHisto);
                            }
                        });


                        drawUIControl();
                    });
                });
            });
        });
    });

    //initialize UI controls

    function drawUIControl() {
        d3.select('#population-display').call(map1);
        d3.select('#population-display-2').call(map2);
        d3.select('#population-control-svg').call(populationSlider);
        d3.select('#age-control-svg').call(ageSlider);      

        $(document).on('click', 'a[href^="#"]', function (event) {
            event.preventDefault();

            $('html, body').animate({
                scrollTop: $($.attr(this, 'href')).offset().top
            }, 1500);
        });  
    }
});
