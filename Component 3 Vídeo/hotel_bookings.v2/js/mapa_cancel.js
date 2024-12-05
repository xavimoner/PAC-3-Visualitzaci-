// mapa_cancel.js
// Càrrega del fitxer TopoJSON
d3.json("./data/countries-110m.json").then(world => {
    // Convertim TopoJSON a GeoJSON
    const geojson = topojson.feature(world, world.objects.countries);

    // Load CSV 
    d3.csv("./data/dades_paisos_with_codes.csv").then(data => {
        const width = 800;
        const height = 500;

        // Convertim dades  codi ONU
        const cancelData = {};
        data.forEach(d => {
            if (+d.cancel_rate < 26) {
                cancelData[d["ONU.CODE"]] = {
                    rate: +d.cancel_rate,
                    code: d["ISO3 CODE"] // Utilitzem el codi ISO3 del país
                };
            }
        });

        // SVG
        const svg = d3.select("#mapa")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Projecció geogràfica
        const projection = d3.geoMercator()
            .scale(130)
            .translate([width / 2, height / 1.5]);

        // Generador de camins
        const path = d3.geoPath().projection(projection);

        // Pintem map
        svg.selectAll("path")
            .data(geojson.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", d => {
                const countryId = +d.id; // codi numèric  GeoJSON
                return cancelData[countryId] ? "var(--dark-olive-green)" : "var(--cornsilk)"; // 
            })
            .attr("stroke", "var(--laurel-green)")
            .attr("stroke-width", 0.5)
            .on("mouseover", function (event, d) {
                const countryId = +d.id;
                const countryData = cancelData[countryId];
                const countryCode = countryData ? countryData.code : "No hi ha dades";
                const cancelRate = countryData ? `${countryData.rate.toFixed(2)}%` : "No hi ha dades";

                d3.select("#mapa-tooltip")
                    .style("display", "block")
                    .html(`<strong>${countryCode}</strong><br>Cancel·lació: ${cancelRate}`)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 30}px`);
                d3.select(this).attr("fill", "var(--alloy-orange)"); // Canvi color  cursor
            })
            .on("mouseout", function () {
                d3.select("#mapa-tooltip").style("display", "none");
                d3.select(this).attr("fill", d => {
                    const countryId = +d.id;
                    return cancelData[countryId] ? "var(--dark-olive-green)" : "var(--cornsilk)";
                });
            });

        // Tooltip
        d3.select("body").append("div")
            .attr("id", "mapa-tooltip")
            .style("position", "absolute")
            .style("background", "rgba(255, 255, 255, 0.9)")
            .style("border", "1px solid var(--laurel-green)")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("display", "none");
    });
});
