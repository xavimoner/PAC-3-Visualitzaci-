// buble_chart.js
// Càrrega de dades
d3.csv("./data/dades_paisos_enriquides.csv").then(data => {
    const width = 800;
    const height = 500;

    // Filtrem cancel·lacions < 26%
    const filteredData = data.filter(d => +d.cancel_rate < 26);

    // Configurem SVG
    const svg = d3.select("#bubble_chart")
        .append("svg")
        .attr("width", width + 200) // Espai extra per la llegenda
        .attr("height", height);

    // Escala mida de les bombolles 
    const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(filteredData, d => +d.benefit_total)])
        .range([10, 50]);

    // NO FUNCIONA ESCALA percentatge REVISAR
    const colorScale = d3.scaleLinear()
        .domain([0, 26]) 
        .range(["var(--laurel-green)", "var(--alloy-orange)"]);

    // Simulem x posar bombolles
    const simulation = d3.forceSimulation(filteredData)
        .force("x", d3.forceX(width / 2).strength(0.05)) // Atraure cap al centre
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("collision", d3.forceCollide(d => radiusScale(+d.benefit_total) + 2)) // Separació de les bombolles
        .on("tick", ticked);

    // Afegim tooltip
    const tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("background", "white")
        .style("border", "1px solid var(--dark-olive-green)")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("display", "none");

    // Dibuixem bombolles
    const circles = svg.selectAll("circle")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("r", d => radiusScale(+d.benefit_total))
        .style("fill", d => colorScale(+d.cancel_rate))
        .style("opacity", 0.8)
        .on("mouseover", function (event, d) {
            tooltip.style("display", "block")
                .html(`<strong>${d.country}</strong><br>
                       Cancel·lació: ${(+d.cancel_rate).toFixed(2)}%<br>
                       ADR: €${(+d.adr_avg).toFixed(2)}<br>
                       Benefici total: €${(+d.benefit_total).toFixed(2)}`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 30}px`);
            d3.select(this).style("stroke", "var(--russet)").style("stroke-width", 2);
        })
        .on("mouseout", function () {
            tooltip.style("display", "none");
            d3.select(this).style("stroke", "none");
        });

    // Afegim codis  centre  bombolles
    const labels = svg.selectAll("text")
        .data(filteredData)
        .enter()
        .append("text")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "var(--dark-olive-green)")
        .text(d => d.country);

    // Funció x actualitzar posició a simulaciñ´
    function ticked() {
        circles
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        labels
            .attr("x", d => d.x)
            .attr("y", d => d.y + 3); 
    }

    // Afegim llegenda
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 50}, ${50})`);

    // Gradient llegenda
    const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "legend-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "var(--alloy-orange)");

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "var(--laurel-green)");

    // Rectangular x gradient
    legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", 200)
        .style("fill", "url(#legend-gradient)");

    // Escala peretiquetes llegenda
    const legendScale = d3.scaleLinear()
        .domain([26, 0])
        .range([0, 200]);

    const legendAxis = d3.axisRight(legendScale)
        .ticks(5)
        .tickFormat(d => `${d}%`);

    // Afegim eix  llegenda
    legend.append("g")
        .attr("transform", "translate(20, 0)")
        .call(legendAxis);

    // Títol  llegenda
    legend.append("text")
        .attr("x", -10)
        .attr("y", -10)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Taxa Cancel·lacions (%)");
});
