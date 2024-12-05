// paisos_seleccionats.js
// Llegim dades
d3.csv("./data/dades_paisos_with_codes.csv").then(data => {
    // Seleccionem només els països amb una taxa de cancel·lació inferior al 26%
    const selectedCountries = data
        .filter(d => +d.cancel_rate < 26)
        .map(d => d.country);

    // Dimensions  núvol
    const width = 800;
    const height = 500;

    // Paleta 
    const colors = [
        "var(--dark-olive-green)", 
        "var(--laurel-green)", 
        "var(--camel)", 
        "var(--alloy-orange)", 
        "var(--russet)"
    ];

    // Configurem layout
    const layout = d3.layout.cloud()
        .size([width, height])
        .words(selectedCountries.map(word => ({text: word, size: 20 + Math.random() * 50})))
        .padding(5)
        .font("Impact")
        .fontSize(d => d.size)
        .on("end", draw);

    layout.start();

    // Dibuixe,m
    function draw(words) {
        d3.select("#my_dataviz").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`)
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => `${d.size}px`)
            .style("fill", () => colors[Math.floor(Math.random() * colors.length)])
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
            .text(d => d.text);
    }
}).catch(error => {
    console.error("Error carregant el CSV:", error);
});
