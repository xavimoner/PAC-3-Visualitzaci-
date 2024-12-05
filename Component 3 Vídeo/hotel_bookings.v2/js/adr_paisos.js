// adr_paisos.js
// Visualització ADR per país
d3.csv("./data/dades_paisos.csv").then(data => {
  const svg = d3.select("#chart");
  const margin = { top: 20, right: 30, bottom: 100, left: 50 };
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  // Afegim definidor de degradat defs
  const defs = svg.append("defs");
  const gradient = defs.append("linearGradient")
      .attr("id", "barGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
      

  // Definim colors degradat
  gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#C4661F"); // 

  gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#783D19"); //

  // Filtrem valors NULL
  data = data.filter(d => d.country !== "NULL");

  // Ordenem  països  ADR
  data.sort((a, b) => d3.descending(+a.adr_avg, +b.adr_avg));

  // Escales
  const x = d3.scaleBand()
              .domain(data.map(d => d.country))
              .range([0, width])
              .padding(0.1);

  const y = d3.scaleLinear()
              .domain([50, d3.max(data, d => +d.adr_avg)]) 
              .range([height, 0]);

  // Afegim eixos
  g.append("g")
   .call(d3.axisLeft(y))
   .selectAll("text")
   .style("fill", "var(--dark-olive-green)") 
   .style("font-size", "12px");

  g.append("g")
   .call(d3.axisBottom(x))
   .attr("transform", `translate(0,${height})`)
   .selectAll("text")
   .attr("transform", "rotate(-45)")
   .style("text-anchor", "end")
   .style("fill", "var(--dark-olive-green)") 
   .style("font-size", "12px");

  // Tooltip x mostrar informació
  const tooltip = d3.select("body").append("div")
      .style("position", "absolute")
      .style("background", "rgba(255, 255, 255, 0.9)")
      .style("border", "1px solid black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("font-size", "14px")
      .style("display", "none")
      .style("pointer-events", "none"); // No interferències cursor

  // Creem barres animades i interactives
  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.country))
    .attr("y", height) 
    .attr("width", x.bandwidth())
    .attr("height", 0) 
    .style("fill", "url(#barGradient)")
    .on("mouseover", (event, d) => { 
        tooltip.style("display", "block")
               .html(`<strong>${d.country}</strong><br>ADR: €${(+d.adr_avg).toFixed(2)}`)
               .style("left", `${event.pageX + 10}px`)
               .style("top", `${event.pageY - 30}px`);
        d3.select(event.target).style("opacity", 0.8);
    })
    .on("mousemove", (event) => { 
        tooltip.style("left", `${event.pageX + 10}px`)
               .style("top", `${event.pageY - 30}px`);
    })
    .on("mouseout", (event) => { 
        tooltip.style("display", "none");
        d3.select(event.target).style("opacity", 1);
    })
    .transition() // Transició  barres creixin amb animació
    .duration(1000) // 1 segon
    .delay((d, i) => i * 50) // Retràs entre barres i fem preogressives
    .attr("y", d => y(+d.adr_avg))
    .attr("height", d => height - y(+d.adr_avg));
});
