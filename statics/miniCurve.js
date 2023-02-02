<<<<<<< HEAD
<<<<<<< HEAD
    function ToggleCurve(ClickedCurve,ID) {
        var addserie = JSON.parse(d3.select("#item_"+ID).attr('value'));
        var legend = d3.select("#item_"+ID+" .miniLegend");
        var path = d3.select("#Curve_"+ID);
        if (ClickedCurve.checked) {
            path
                .attr("stroke", "coral" )
                .attr("stroke-width", 2);
                // serie.push({name:'pressure', Unit:'Pa', precision:1, NbPoints:NbPts},)
                // const DataPromise = Request.serie.map(serie => GetDataFull(addserie))
                Request.serie.push(addserie);
                // console.log('Add Serie',Request);

                const DataPromise = [Request.serie[Request.serie.length - 1]].map(serie => GetDataFull(serie))
                DrawNewSeries(DataPromise,[Request.serie[Request.serie.length - 1]]);
        } else {
            path
                .attr("stroke", "steelblue" )
                .attr("stroke-width", 1);
                // Array.prototype.remove = function(value) {
                //     return  this.filter(item => item !== value)
                // }
                serie = serie.filter(function(item) {
                    console.log(item);
                        if(item.name !== 'pressure' && item.tags !== ''){
                            return item
                        }
                    }
                )
            }
        // main()
    }
    
    // set the dimensions and margins of the graph
    var minimargin = {top: 1, right: 50, bottom: 1, left: 1}, // seront ajouté a Width et Height
        miniwidth = 150,
        miniheight = 30,
        miniNbPts = Math.round(miniwidth/2);

    var miniDateStart= new Date(Date.now() - 30 * (24 * 60 * 60 * 1000));
    var miniDateEnd= new Date(); // (new Date(Date.now() + 2 * (60 * 60 * 1000))) // (new date()).toISOString()   

    d3.json('/API/db/list')
        .then(
            json => { // Mise en forme des data au format pour D3.js
                json.map(
                    serie => {
                        serie.NbPoints = miniNbPts;
                        serie.times = {
                            start: miniDateStart,
                            end: miniDateEnd
                        }
                        serie.tags = serie.tags.map(tag => {return 'and '+tag});
                        GetDataMini(serie);
                    }
                )
            }
        )

    const GetDataMini = function(_serie) {
        var serieJson = JSON.stringify(_serie);
        // console.log(_serie);
        // console.log(serieJson);

        var ID = id(serieJson);
        // append the svg object to the body of the page
        // d3.select("#leftlistCurve")
        //     .attr("width", width + margin.left + margin.right);
        var nextMini = d3.select("#listCurve")
            .append("li")
            .append("label")
                .attr("for", "item_"+ID);

        nextMini.append("input")
                .attr("id", "item_"+ID)
                .attr("class", "MiniCurve")
                .attr("type", "checkbox")
                .attr("onchange","ToggleCurve(this,'"+ID+"');")
                .attr("value", serieJson);
            
        var minsvg = nextMini
            .append("svg")
                .attr("width", miniwidth + minimargin.left + minimargin.right)
                .attr("height", miniheight + minimargin.top + minimargin.bottom);

        // console.log(_serie);
        nextMini.append("p")
                .text(_serie.name)
                .attr("title", _serie.tags.join("\n"))
                .attr("class", "miniLegend");

        var minisvg = minsvg.append("g")
                .attr("transform", "translate(" + minimargin.left + "," + minimargin.top + ")");


        return d3.json('/API/db/read', { // collecte des data Raw aupres du server
                method:"POST",
                body: serieJson,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(json => { // Mise en forme des data au format pour D3.js
                // console.log('json=',json)
                _serie.data = json.filter( function(d) { return d.mean !== null}).map(data => {
                    const date = d3.isoParse(data.time);
                    const value = data.mean;
                        return {date, value};
                });
                // console.log('_serie=',_serie)
                return _serie;
            })
            .then(Curve => {
                // console.log('Curve',Curve);

                // definition de l'echelle horizontale
                xScale = d3.scaleUtc()
                    .domain([d3.isoParse(miniDateStart), d3.isoParse(miniDateEnd)])
                    .range([0, miniwidth]);
                yScales = d3.scaleLinear()
                    .domain(d3.extent(Curve.data, d => d.value)) // [d3.min(Curve.data, d => d.value), d3.max(Curve.data, d => d.value)]
                    .range([miniheight, 0]);
                // console.log('Curve=',Curve)
                Curve.line = d3.line()
                    // .defined(function (d) { return d; })
                    // .defined(function (d) { return d[1] !== null; })
                    // .defined(function (d) { return d.y !== null; })
                    // .defined(function (d) { return d.y; })
                    .x(d => xScale(d.date))
                    .y(d => yScales(d.value))
                    .curve(d3.curveMonotoneX) // curveBundle, curveCatmullRom.alpha(1), curveCardinal, curveMonotoneX

                // Curve.xPosOfYAxis = axisBuild(yScales[(Curve.Unit)]);

                    Curve.domLine = minisvg.append("path")
                        .datum(Curve.data)
                        .attr("id", "Curve_"+ID)
                        .attr("z-index", -1)
                        .attr("fill", "none")
                        .attr("stroke", "steelblue" )
                        .attr("stroke-width", 1)
                        .attr("d", Curve.line);

                    // console.log((d3.max(_serie.data, d => d.value))+"");
                    minsvg.append("text")
                        .attr("class", "miniLegend")
                        .attr("dx", miniwidth)
                        .attr("dy", 10)
                        .text((d3.max(_serie.data, d => d.value))+" "+_serie.Unit);
            
                    // console.log((d3.min(_serie.data, d => d.value))+"");
                    minsvg.append("text")
                        .attr("class", "miniLegend")
                        .attr("dx", miniwidth)
                        .attr("dy", miniheight)
                        .text((d3.min(_serie.data, d => d.value))+" "+_serie.Unit);

                    return Curve
                }
            )
=======
    function ToggleCurve(ClickedCurve,ID) {
        var addserie = JSON.parse(d3.select("#item_"+ID).attr('value'));
        var legend = d3.select("#item_"+ID+" .miniLegend");
        var path = d3.select("#Curve_"+ID);
        if (ClickedCurve.checked) {
            path
                .attr("stroke", "coral" )
                .attr("stroke-width", 2);
                // serie.push({name:'pressure', Unit:'Pa', precision:1, NbPoints:NbPts},)
                // const DataPromise = Request.serie.map(serie => GetDataFull(addserie))
                Request.serie.push(addserie);
                console.log('Add Serie',Request.serie);

                const DataPromise = Request.serie.map(serie => GetDataFull(serie))
                DrawNewSeries(DataPromise,[addserie]);
        } else {
            path
                .attr("stroke", "steelblue" )
                .attr("stroke-width", 1);
                // Array.prototype.remove = function(value) {
                //     return  this.filter(item => item !== value)
                // }
                serie = serie.filter(function(item) {
                    console.log(item);
                        if(item.name !== 'pressure' && item.tags !== ''){
                            return item
                        }
                    }
                )
            }
        // main()
    }
    
    // set the dimensions and margins of the graph
    var minimargin = {top: 1, right: 50, bottom: 1, left: 1}, // seront ajouté a Width et Height
        miniwidth = 150,
        miniheight = 30,
        miniNbPts = Math.round(miniwidth/2);

    var miniDateStart= new Date(Date.now() - 30 * (24 * 60 * 60 * 1000));
    var miniDateEnd= new Date(); // (new Date(Date.now() + 2 * (60 * 60 * 1000))) // (new date()).toISOString()   

    d3.json('/API/db/list')
        .then(
            json => { // Mise en forme des data au format pour D3.js
                json.map(
                    serie => {
                        serie.NbPoints = miniNbPts;
                        serie.times = {
                            start: miniDateStart,
                            end: miniDateEnd
                        }
                        serie.tags = serie.tags.map(tag => {return 'and '+tag});
                        GetDataMini(serie);
                    }
                )
            }
        )

    const GetDataMini = function(_serie) {
        var serieJson = JSON.stringify(_serie);
        // console.log(_serie);
        // console.log(serieJson);

        var ID = id(serieJson);
        // append the svg object to the body of the page
        // d3.select("#leftlistCurve")
        //     .attr("width", width + margin.left + margin.right);
        var nextMini = d3.select("#listCurve")
            .append("li")
            .append("label")
                .attr("for", "item_"+ID);

        nextMini.append("input")
                .attr("id", "item_"+ID)
                .attr("class", "MiniCurve")
                .attr("type", "checkbox")
                .attr("onchange","ToggleCurve(this,'"+ID+"');")
                .attr("value", serieJson);
            
        var minsvg = nextMini
            .append("svg")
                .attr("width", miniwidth + minimargin.left + minimargin.right)
                .attr("height", miniheight + minimargin.top + minimargin.bottom);

        // console.log(_serie);
        nextMini.append("p")
                .text(_serie.name)
                .attr("title", _serie.tags.join("\n"))
                .attr("class", "miniLegend");

        var minisvg = minsvg.append("g")
                .attr("transform", "translate(" + minimargin.left + "," + minimargin.top + ")");


        return d3.json('/API/db/read', { // collecte des data Raw aupres du server
                method:"POST",
                body: serieJson,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(json => { // Mise en forme des data au format pour D3.js
                // console.log('json=',json)
                _serie.data = json.filter( function(d) { return d.mean !== null}).map(data => {
                    const date = d3.isoParse(data.time);
                    const value = data.mean;
                        return {date, value};
                });
                // console.log('_serie=',_serie)
                return _serie;
            })
            .then(Curve => {
                // console.log('Curve',Curve);

                // definition de l'echelle horizontale
                xScale = d3.scaleUtc()
                    .domain([d3.isoParse(miniDateStart), d3.isoParse(miniDateEnd)])
                    .range([0, miniwidth]);
                yScales = d3.scaleLinear()
                    .domain(d3.extent(Curve.data, d => d.value)) // [d3.min(Curve.data, d => d.value), d3.max(Curve.data, d => d.value)]
                    .range([miniheight, 0]);
                // console.log('Curve=',Curve)
                Curve.line = d3.line()
                    // .defined(function (d) { return d; })
                    // .defined(function (d) { return d[1] !== null; })
                    // .defined(function (d) { return d.y !== null; })
                    // .defined(function (d) { return d.y; })
                    .x(d => xScale(d.date))
                    .y(d => yScales(d.value))
                    .curve(d3.curveMonotoneX) // curveBundle, curveCatmullRom.alpha(1), curveCardinal, curveMonotoneX

                // Curve.xPosOfYAxis = axisBuild(yScales[(Curve.Unit)]);

                    Curve.domLine = minisvg.append("path")
                        .datum(Curve.data)
                        .attr("id", "Curve_"+ID)
                        .attr("z-index", -1)
                        .attr("fill", "none")
                        .attr("stroke", "steelblue" )
                        .attr("stroke-width", 1)
                        .attr("d", Curve.line);

                    // console.log((d3.max(_serie.data, d => d.value))+"");
                    minsvg.append("text")
                        .attr("class", "miniLegend")
                        .attr("dx", miniwidth)
                        .attr("dy", 10)
                        .text((d3.max(_serie.data, d => d.value))+" "+_serie.Unit);
            
                    // console.log((d3.min(_serie.data, d => d.value))+"");
                    minsvg.append("text")
                        .attr("class", "miniLegend")
                        .attr("dx", miniwidth)
                        .attr("dy", miniheight)
                        .text((d3.min(_serie.data, d => d.value))+" "+_serie.Unit);

                    return Curve
                }
            )
>>>>>>> 663f9126628ca8ef0afeaa21b5d4236d025ed721
=======
    function ToggleCurve(ClickedCurve,ID) {
        var addserie = JSON.parse(d3.select("#item_"+ID).attr('value'));
        var legend = d3.select("#item_"+ID+" .miniLegend");
        var path = d3.select("#Curve_"+ID);
        if (ClickedCurve.checked) {
            path
                .attr("stroke", "coral" )
                .attr("stroke-width", 2);
                // serie.push({name:'pressure', Unit:'Pa', precision:1, NbPoints:NbPts},)
                // const DataPromise = Request.serie.map(serie => GetDataFull(addserie))
                Request.serie.push(addserie);
                // console.log('Add Serie',Request);

                const DataPromise = [Request.serie[Request.serie.length - 1]].map(serie => GetDataFull(serie))
                DrawNewSeries(DataPromise,[Request.serie[Request.serie.length - 1]]);
        } else {
            path
                .attr("stroke", "steelblue" )
                .attr("stroke-width", 1);
                // Array.prototype.remove = function(value) {
                //     return  this.filter(item => item !== value)
                // }
                serie = serie.filter(function(item) {
                    console.log(item);
                        if(item.name !== 'pressure' && item.tags !== ''){
                            return item
                        }
                    }
                )
            }
        // main()
    }
    
    // set the dimensions and margins of the graph
    var minimargin = {top: 1, right: 50, bottom: 1, left: 1}, // seront ajouté a Width et Height
        miniwidth = 150,
        miniheight = 30,
        miniNbPts = Math.round(miniwidth/2);

    var miniDateStart= new Date(Date.now() - 30 * (24 * 60 * 60 * 1000));
    var miniDateEnd= new Date(); // (new Date(Date.now() + 2 * (60 * 60 * 1000))) // (new date()).toISOString()   

    d3.json('/API/db/list')
        .then(
            json => { // Mise en forme des data au format pour D3.js
                json.map(
                    serie => {
                        serie.NbPoints = miniNbPts;
                        serie.times = {
                            start: miniDateStart,
                            end: miniDateEnd
                        }
                        serie.tags = serie.tags.map(tag => {return 'and '+tag});
                        GetDataMini(serie);
                    }
                )
            }
        )

    const GetDataMini = function(_serie) {
        var serieJson = JSON.stringify(_serie);
        // console.log(_serie);
        // console.log(serieJson);

        var ID = id(serieJson);
        // append the svg object to the body of the page
        // d3.select("#leftlistCurve")
        //     .attr("width", width + margin.left + margin.right);
        var nextMini = d3.select("#listCurve")
            .append("li")
            .append("label")
                .attr("for", "item_"+ID);

        nextMini.append("input")
                .attr("id", "item_"+ID)
                .attr("class", "MiniCurve")
                .attr("type", "checkbox")
                .attr("onchange","ToggleCurve(this,'"+ID+"');")
                .attr("value", serieJson);
            
        var minsvg = nextMini
            .append("svg")
                .attr("width", miniwidth + minimargin.left + minimargin.right)
                .attr("height", miniheight + minimargin.top + minimargin.bottom);

        // console.log(_serie);
        nextMini.append("p")
                .text(_serie.name)
                .attr("title", _serie.tags.join("\n"))
                .attr("class", "miniLegend");

        var minisvg = minsvg.append("g")
                .attr("transform", "translate(" + minimargin.left + "," + minimargin.top + ")");


        return d3.json('/API/db/read', { // collecte des data Raw aupres du server
                method:"POST",
                body: serieJson,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(json => { // Mise en forme des data au format pour D3.js
                // console.log('json=',json)
                _serie.data = json.filter( function(d) { return d.mean !== null}).map(data => {
                    const date = d3.isoParse(data.time);
                    const value = data.mean;
                        return {date, value};
                });
                // console.log('_serie=',_serie)
                return _serie;
            })
            .then(Curve => {
                // console.log('Curve',Curve);

                // definition de l'echelle horizontale
                xScale = d3.scaleUtc()
                    .domain([d3.isoParse(miniDateStart), d3.isoParse(miniDateEnd)])
                    .range([0, miniwidth]);
                yScales = d3.scaleLinear()
                    .domain(d3.extent(Curve.data, d => d.value)) // [d3.min(Curve.data, d => d.value), d3.max(Curve.data, d => d.value)]
                    .range([miniheight, 0]);
                // console.log('Curve=',Curve)
                Curve.line = d3.line()
                    // .defined(function (d) { return d; })
                    // .defined(function (d) { return d[1] !== null; })
                    // .defined(function (d) { return d.y !== null; })
                    // .defined(function (d) { return d.y; })
                    .x(d => xScale(d.date))
                    .y(d => yScales(d.value))
                    .curve(d3.curveMonotoneX) // curveBundle, curveCatmullRom.alpha(1), curveCardinal, curveMonotoneX

                // Curve.xPosOfYAxis = axisBuild(yScales[(Curve.Unit)]);

                    Curve.domLine = minisvg.append("path")
                        .datum(Curve.data)
                        .attr("id", "Curve_"+ID)
                        .attr("z-index", -1)
                        .attr("fill", "none")
                        .attr("stroke", "steelblue" )
                        .attr("stroke-width", 1)
                        .attr("d", Curve.line);

                    // console.log((d3.max(_serie.data, d => d.value))+"");
                    minsvg.append("text")
                        .attr("class", "miniLegend")
                        .attr("dx", miniwidth)
                        .attr("dy", 10)
                        .text((d3.max(_serie.data, d => d.value))+" "+_serie.Unit);
            
                    // console.log((d3.min(_serie.data, d => d.value))+"");
                    minsvg.append("text")
                        .attr("class", "miniLegend")
                        .attr("dx", miniwidth)
                        .attr("dy", miniheight)
                        .text((d3.min(_serie.data, d => d.value))+" "+_serie.Unit);

                    return Curve
                }
            )
>>>>>>> 9ee081f (feat(series):transition on adding existing unit)
    }