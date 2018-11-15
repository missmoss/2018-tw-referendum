d3.csv("data.csv").then(function(data) {
	const draw_scp = (...ind_vars) => {
		var div = document.getElementsByClassName("scatter")[0];
		var width = parseInt(getComputedStyle(div).width.replace(/px/g, "")),
		height = parseInt(getComputedStyle(div).height.replace(/px/g, "")),
		margins = getComputedStyle(div).margin.replace(/px/g, "").split(" "),
		margin = {
			"top": parseInt(margins[0]),
			"right": parseInt(margins[1]),
			"bottom": parseInt(margins[2]),
			"left": parseInt(margins[3])
		};

		y = d3.scaleLinear()
		.domain([d3.min(data, d => (Number(d.college_p)-0.05)), d3.max(data, d => (Number(d.college_p)+0.1))]).nice()
		.range([height - margin.bottom, margin.top]);

		x = d3.scaleLinear()
		.domain([d3.min(data, d => (Number(d.vote_p)-0.05)), d3.max(data, d => (Number(d.vote_p)+0.05))]).nice()
		.range([margin.left, width - margin.right]);

		z = d3.scaleThreshold()
		.range(["#355C7D", "#F67280"]);

		const svg = d3.select("#scp1").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Add the x-axis.
		xAxis = g => g
		.attr("transform", `translate(0,${height - margin.bottom})`)
		.call(d3.axisBottom(x).ticks(width / 80).tickFormat(d3.format(".0%")))
		.call(g => g.select(".domain").remove());

		// Add the y-axis.
		yAxis = g => g
		.attr("transform", `translate(${margin.left},0)`)
		.call(d3.axisLeft(y).tickFormat(d3.format(".0%")))
		.call(g => g.select(".domain").remove())
		.call(g => g.selectAll(".tick line")
			.filter(d => d === 0)
			.clone()
			.attr("x2", width - margin.right - margin.left)
			.attr("stroke", "#ccc"))
		.call(g => g.append("text")
			.attr("fill", "#000")
			.attr("x", 5)
			.attr("y", margin.top)
			.attr("dy", "0.32em")
			.attr("text-anchor", "start")
			.attr("font-weight", "bold")
			.text("college_percentage"))

		svg.append("g")
		.call(xAxis);

		svg.append("g")
		.call(yAxis);

		svg.append("g")
		.attr("stroke", "#000")
		.attr("stroke-opacity", 0.2)
		.selectAll("circle")
		.data(data)
		.enter().append("circle")
		.attr("cx", d => x(d.vote_p))
		.attr("cy", d => y(d.college_p))
		.attr("fill", d => z(d.vote_p))
		.attr("r", 2.5);

		svg.append("line")
		.attr("x1", x(0.5))  
		.attr("y1", 0)
		.attr("x2", x(0.5))  
		.attr("y2", height - margin.top - margin.bottom)
		.style("stroke-width", 1)
		.style("stroke", "#D3D3D3")
		.style("fill", "none");

		return svg.node();
	}
	draw_scp(); 
});