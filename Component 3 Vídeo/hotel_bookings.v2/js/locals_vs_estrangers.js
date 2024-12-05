// locals_vs_estrangers.js
d3.csv("./data/dades_origen.csv").then(data => {
  const svg = d3.select("#chart3");
  const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  // Escales
  const x = d3.scaleBand()
              .domain(data.map(d => d.origin))
              .range([0, width])
              .padding(0.1);

  const y = d3.scaleLinear()
              .domain([0, d3.max(data, d => +d.cancel_rate)])
              .range([height, 0]);

  // eix Y
  g.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("fill", "var(--dark-olive-green)") // Text de l'eix Y
    .style("font-size", "12px");

  // eix X
  g.append("g")
    .call(d3.axisBottom(x))
    .attr("transform", `translate(0,${height})`)
    .selectAll("text")
    .style("fill", "var(--dark-olive-green)") // Text de l'eix X
    .style("font-size", "12px");

  // Tooltip
  const tooltip = d3.select("body").append("div")
    .style("position", "absolute")
    .style("background", "rgba(255, 255, 255, 0.9)")
    .style("border", "1px solid black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("font-size", "14px")
    .style("display", "none")
    .style("pointer-events", "none");

  // Barres anim + interact
  g.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.origin))
    .attr("y", height) 
    .attr("width", x.bandwidth())
    .attr("height", 0) 
    .style("fill", d => (d.origin === "Resident" ? "var(--alloy-orange)" : "var(--camel)")) 
    .on("mouseover", (event, d) => { 
      tooltip
        .style("display", "block")
        .html(`<strong>${d.origin}</strong><br>Cancel·lació: ${(+d.cancel_rate).toFixed(2)}%`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 30}px`);
      d3.select(event.target).style("opacity", 0.8);
    })
    .on("mousemove", (event) => { 
      tooltip
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 30}px`);
    })
    .on("mouseout", (event) => { 
      tooltip.style("display", "none");
      d3.select(event.target).style("opacity", 1); 
    })
    .transition() 
    .duration(1000) // 1 segon
    .delay((d, i) => i * 200) // retard barra 
    .attr("y", d => y(+d.cancel_rate))
    .attr("height", d => height - y(+d.cancel_rate));
});
