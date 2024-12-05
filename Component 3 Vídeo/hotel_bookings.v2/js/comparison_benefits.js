// Dades càlcul
const data = [
    { label: "Actual", value: 8144620, color: "var(--laurel-green)" },
    { label: "Improved", value: 8388807, color: "var(--alloy-orange)" }
];

// Dimensions 
const width = 800;
const height = 300;
const margin = { top: 20, right: 20, bottom: 50, left: 100 };

//  SVG
const svg = d3.select("#comparison_chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Escales
const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value) * 1.1]) // Ampliem una mica el màxim
    .range([margin.left, width - margin.right]);

const yScale = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([margin.top, height - margin.bottom])
    .padding(0.4);

// Afegim
svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", xScale(0))
    .attr("y", d => yScale(d.label))
    .attr("width", 0) 
    .attr("height", yScale.bandwidth())
    .attr("fill", d => d.color)
    .transition() 
    .duration(1000)
    .attr("width", d => xScale(d.value) - xScale(0));

// Labels fi barres
svg.selectAll("text.value")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "value")
    .attr("x", d => xScale(d.value) + 5)
    .attr("y", d => yScale(d.label) + yScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .text(d => `${d.value.toLocaleString()} €`)
    .style("font-size", "12px")
    .style("fill", "var(--dark-olive-green)");

// eix Y
svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .style("fill", "var(--dark-olive-green)");

// Títol
svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top - 5)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("fill", "var(--dark-olive-green)")
    .text("Comparació de Beneficis: Actual vs Millorat");
