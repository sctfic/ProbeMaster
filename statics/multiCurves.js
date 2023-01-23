var serieCounter=0;

function main() {
    console.log(DefaultSerie);
    Request = {
        serie:DefaultSerie,
        DateStart: new Date(Date.now() - 280 * (24 * 60 * 60 * 1000)),
        DateEnd: new Date(), // (new Date(Date.now() + 2 * (60 * 60 * 1000))) // (new date()).toISOString()
        yScales:{},
        xScale:{}
    }

    // console.log('areaWidth',areaWidth, 'areaHeight',areaHeight, 'margin',margin, 'width',width, 'height',height, 'NbPts',NbPts)
    d3.select('#SvgChart g').remove()
    svg = svg = d3.select('#SvgChart').attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // definition de l'echelle horizontale commune
    Request.xScale = d3.scaleUtc()
                .domain([d3.isoParse(Request.DateStart), d3.isoParse(Request.DateEnd)])
                .range([0, width]);

    // console.log(Request.DateEnd, Request.DateEnd.tolocal() )
    // Add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(Request.xScale))
        .transition().duration(1000).call(d3.axisBottom(Request.xScale));

    // const DataPromise = GetDataFull(DefaultSerie);
    const DataPromise = Request.serie.map(serie => GetDataFull(serie))

    DrawNewSeries(DataPromise, Request.serie);

    // Request.yScales.forEach(yAxes => ConstructYAxes(yAxes))
    // Request.serie.forEach(serie => DrawCurve(serie))
    // append the rectangle to capture mouse
    const Sensitive = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { Request.serie.forEach(Curve => Curve.focus.style("display", null)); })
        .on("mousemove", mousemove)
        // .on("mousemove", function(event) {
        //     let coords = d3.pointer(event);
        //     console.log( coords[0], coords[1] ) // log the mouse x,y position
        // })
        // .on("mouseout", function() { Request.serie.forEach(Curve => Curve.focus.style("display", "none")); })
        // .call(zoom)

}
function DrawNewSeries(DataPromise, NewSeries) {
    console.log(NewSeries);
    Promise
    .all(DataPromise)
    .then(
        () => {
            // console.log('NewSeries',NewSeries);
            return NewSeries.map(
                Curve => {
                    // console.log('Curve=',Curve)
                    // console.log('Request.yScales',Request.yScales);
                    // console.log('Request.yScales['+Curve.Unit+']',Request.yScales[(Curve.Unit)]);
                    Curve.line = d3.line()
                        // .defined(function (d) { return d; })
                        // .defined(function (d) { return d[1] !== null; })
                        // .defined(function (d) { return d.y !== null; })
                        // .defined(function (d) { return d.y; })
                        .x(d => Request.xScale(d.date))
                        .y(d => Request.yScales[Curve.Unit](d.value))
                        .curve(d3.curveMonotoneX) // curveBundle, curveCatmullRom.alpha(1), curveCardinal, curveMonotoneX

                    Curve.xPosOfYAxis = axisBuild(Request.yScales[(Curve.Unit)]);

                    // Set the gradient
                    svg.append("linearGradient")
                        .attr("id", "line-gradient-"+Curve.Count)
                        .attr("gradientUnits", "userSpaceOnUse")
                        .attr("x1", 0)
                        .attr("y1", Request.yScales[Curve.Unit](d3.min(Curve.data, d => d.value)))
                        .attr("x2", 0)
                        .attr("y2", Request.yScales[Curve.Unit](d3.max(Curve.data, d => d.value)))
                        .selectAll("stop")
                        .data([
                            {offset: "0%", color: Curve.Color.high},
                            {offset: "100%", color: Curve.Color.high}
                        ])
                        .enter().append("stop")
                        .attr("offset", function(d) { return d.offset; })
                        .attr("stop-color", function(d) { return d.color; });

                        Curve.domLine = svg.append("path")
                            .datum(Curve.data)
                            .attr("z-index", -1)
                            .attr("fill", "none")
                            .attr("stroke", "url(#line-gradient-"+Curve.Count+")" )
                            .attr("stroke-width", 1)
                            .attr("d", Curve.line)
                            .transition()
                            .duration(1000)



                    return Curve
                }
            )
        }
    )
    .then(() => {
        NewSeries.map(
            Curve => {
                // Construction du cursseur
                Curve.focus = svg.append("g") 
                    // .style("display", "none");
                if(Curve.Count == 0){
                    // append the X line Verticale
                    Curve.focus.append("line")
                        .attr("class", "x")
                        .style("stroke", 'gray')
                        .style("stroke-dasharray", "3,3") // pointillees
                        // .style("opacity", 0.5)
                        .attr("y1", 0)
                        .attr("y2", height);
                    // Fond local pour la lisibilité du text
                    Curve.focus.append("text")
                        .attr("class", "y3 shadow")
                        .style("stroke-width", "4px")
                        .style("stroke", "#3c3c3c")
                        .attr("dx", '-5.2em')
                        .attr("dy", '1.6em');
                    Curve.focus.append("text")
                        .attr("class", "y3 measure")
                        .attr("dx", '-5.2em')
                        .attr("dy", '1.6em');
                }
                if (null != Curve.xPosOfYAxis){
                    // append the y line Horizontale
                    Curve.focus.append("line")
                        .attr("class", "y-"+Curve.Count)
                        .style("stroke", Curve.Color.high)
                        .style("stroke-dasharray", "3,3") // pointillees
                        // .style("opacity", 0.8)
                        .attr("x1", width)
                        .attr("x2", width);
                }
                // Fond local pour la lisibilité du cercle 
                Curve.focus.append("circle")
                    .attr("class", "shadow y-"+Curve.Count)
                    .style("fill", "none")
                    .style("stroke-width", "6px")
                    .style("stroke", "#3c3c3c")
                    // .style("opacity", 0.8)
                    .attr("r", 6);
                // Fond local pour la lisibilité du text
                Curve.focus.append("text")
                    .attr("class", "y1 shadow")
                    .style("stroke-width", "4px")
                    .style("stroke", "#3c3c3c")
                    .attr("dx", 9)
                    .attr("dy", -6);
                // Cercle cursseur
                Curve.focus.append("circle")
                    .attr("class", "y-"+Curve.Count)
                    .style("fill", "none")
                    .style("stroke", Curve.Color.high)
                    .attr("r", 6);
                // Text cursseur
                Curve.focus.append("text")
                    .attr("class", "y1 measure")
                    // .style("fill", Curve.Color.high)
                    .attr("dx", 9)
                    .attr("dy", -6);
                }
        )
    })
}


function GetDataFull(serie) {
    console.log('serie', serie);
    serie.Color = {
        low:colorScale(2*serieCounter),
        high:colorScale(2*serieCounter+1)
    }
    serie.NbPoints = NbPts;
    serie.Count = serieCounter++;
    Request.yScales.count = 0
    console.log('Request.serie', Request.serie);

    return d3.json('/API/db/read', { // collecte des data Raw aupres du server
        method:"POST",
        body: JSON.stringify({
            name: serie.name,
            tags: serie.tags,
            times: {
                start: Request.DateStart,
                end: Request.DateEnd
            },
            precision: serie.precision,
            NbPoints: serie.NbPoints
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(json => { // Mise en forme des data au format pour D3.js
        // console.log('json=',json)
        serie.data = json.filter( function(d) { return d.mean !== null}).map(data => {
            const date = d3.isoParse(data.time);
            const value = data.mean;
                return {date, value};
        });
        // console.log('serie=',serie)
        return serie;
    })
    .then( // Construction des Axes X et raprochement en cas d'unite similaire
        Serie => {
            if (!Request.yScales[Serie.Unit]){ // si l'axe Y de cette unite n'existe pas
                Request.yScales[Serie.Unit] = d3.scaleLinear()
                    .domain(d3.extent(Serie.data, d => d.value)) // [d3.min(Serie.data, d => d.value), d3.max(Serie.data, d => d.value)]
                    .range([height, 0]);
                Request.yScales[Serie.Unit].count = (Request.yScales.count)
                Request.yScales.count++
            } else{
                var dataDomain = Request.yScales[Serie.Unit]
                                        .domain()
                                        .concat(d3.extent(Serie.data, d => d.value))
                console.log('dataDomain',dataDomain);
                Request.yScales[Serie.Unit]
                        .domain(d3.extent(dataDomain));
                // console.log('d3.extent(dataDomain)',Request.yScales[Serie.Unit].domain());
            }
            // return Serie;
        }
    )
}

function axisBuild(yAxe){
    // console.log('yAxe['+yAxe.count+']',yAxe.Unit)
    switch (yAxe.count) {
        case 0:
            // Add the y Axis Left oriented Left
            svg.append("g")
                .call(d3.axisLeft(yAxe))
                .call(g => g.selectAll(".tick text").append("tspan").text(yAxe.Unit));
            xPosOfYAxis = 0;
            break;
        case 1:
            // Add the y Axis Right oriented Right
            svg.append("g")
                .call(d3.axisRight(yAxe))
                .call(g => g.selectAll(".tick text").append("tspan").text(yAxe.Unit))
                .attr("transform", "translate(" + width + ",0)");
            xPosOfYAxis = width;
            break;
        case 2:
            // Add the y Axis Left oriented Right
            svg.append("g")
                .call(d3.axisRight(yAxe))
                .call(g => g.selectAll(".tick text").append("tspan").text(yAxe.Unit));            
            xPosOfYAxis = 0;
            break;
        case 3:
            // Add the y Axis Right oriented Left
            svg.append("g")
                .call(d3.axisLeft(yAxe))
                .call(g => g.selectAll(".tick text").append("tspan").text(yAxe.Unit))
                .attr("transform", "translate(" + width + ",0)");
            xPosOfYAxis = width;
            break;
        default: // on ne peu afficher que 4 Axes, les suivant sont cache
            xPosOfYAxis = null;
            break;
    }
    return xPosOfYAxis;
}

const bisectDate = d3.bisector(function(d) {return d.date; }).left;
function mousemove(event) {
    // console.log('event',event,'this', this,'d3.pointer(event,this)',d3.pointer(event,this));
    var x0 = Request.xScale.invert(d3.pointer(event,this)[0]);
    // console.log('Request', Request);
    Request.serie.forEach( Curve => {
        // console.log('Curve', Curve,'x0',x0);
        var i = bisectDate(Curve.data, x0, 1);
        var d0 = Curve.data[i - 1],
            d1 = Curve.data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        Curve.focus.selectAll("circle.y-"+Curve.Count) // Cercle
            .attr("transform","translate(" + Request.xScale(d.date) + "," +Request.yScales[Curve.Unit](d.value) + ")");
        Curve.focus.selectAll("text.y1") // Valeur et Unite
            .attr("transform","translate(" + Request.xScale(d.date) + "," + Request.yScales[Curve.Unit](d.value) + ")")
            .text(d.value+Curve.Unit);
        if(Curve.Count == 0){
            Curve.focus.select(".x") // repere vertical commun
                .attr("transform","translate(" + Request.xScale(d.date) + ",0)")
                // .attr("y1", height)
                .attr("y2", height);
            Curve.focus.selectAll("text.y3") // date
                .attr("transform","translate(" + (Request.xScale(d.date)) + ","+(height)+")")
                .text(formatDate(d.date));
        }
        if (null != Curve.xPosOfYAxis){
            Curve.focus.select(".y-"+Curve.Count) // repere Y horizontal
                .attr("transform","translate(0," +Request.yScales[Curve.Unit](d.value) + ")")
                .attr("x1",Curve.xPosOfYAxis)
                .attr("x2", Request.xScale(d.date));
        }
    })
}



// const zoom = d3.zoom()
//     .scaleExtent([1, 4096])
//     .extent([[margin.left, 0], [width - margin.right, height]])
//     .translateExtent([[margin.left, -Infinity], [width - margin.right, Infinity]])
//     .on("zoom", zoomed);



function zoomed(params) {
    console.log('zoomed')
}



// Create the event
var event = new CustomEvent("resize", { "detail": "Example of an event" });

// Dispatch/Trigger/Fire the event
document.dispatchEvent(event);
