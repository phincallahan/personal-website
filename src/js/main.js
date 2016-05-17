window.onload = function() {
    var sections = setUpNav();

              
    sections['project-euler'].forEach(function(element) {
        element.classList.toggle('current');
    });
    setUpEuler();
    sections['project-euler'].forEach(function(element) {
        element.classList.toggle('current');
    });
}

function setUpNav() {
	var headerElements = document.querySelectorAll("header li");
	var sections = new Map();

	for(var i = 0; i < headerElements.length; i++)	{
		sections[headerElements[i].textContent] = [
            document.querySelector("#"+headerElements[i].textContent),
            headerElements[i]
        ];
	}

	if(window.location.hash) 
		var currentSection = window.location.hash.substring(1);
	else 
		var currentSection = headerElements[0].textContent;

    sections[currentSection].forEach(function(element) {
        element.classList.toggle('current');
    });

	for(var i = 0; i < headerElements.length; i++) {
		headerElements[i].addEventListener('click', function(event) {
            if(this.textContent != currentSection) {
                sections[currentSection].forEach(function(element) {
                    element.classList.toggle('current');
                });

                sections[this.textContent].forEach(function(element) {
                    element.classList.toggle('current');
                });

                currentSection = this.textContent;
            }

            window.scrollTo(0,0);
		});
	}

    return sections;
}

function setUpEuler() {
    /**
    var solutions = document.querySelectorAll(".solution");

    var solved = Array.from(solutions).map(function(s) {
        return Number(s.childNodes[1].textContent);
    });

    var max = Math.max.apply(null, solved);

    var container = document.querySelector(".solution-container");
    var cwidth = Number(window.getComputedStyle(container)
                              .getPropertyValue("width")
                              .replace("px", ""));

    var swidth = solutions[0].scrollWidth*1.25;
    container.style.height = String(Math.ceil(max/(cwidth/swidth))*swidth)+"px";

    for(var i = 0; i < solutions.length; i++) {
        var node = solutions[i];
        var num = Number(node.childNodes[1].textContent);
        node.style.left = String(((num-1)%(cwidth/swidth))*(swidth))+"px";
        node.style.top = String((Math.floor((num-1)/(cwidth/swidth))*swidth))+"px";
        console.log(cwidth/swidth);
    }
     **/

    var container = d3.select(".solution-container");
    var width = 600;
    container.attr("width", width);

    d3.json("euler.json", function(error, data) {
        if(error) console.log(error);

        var margin = .075;
        var boxDim = 30;
        var tableDim = width/boxDim;

        var max = d3.max(data, function(d) {return d.number;}); 
        var height = Math.ceil(max/(width/boxDim))*boxDim + Math.floor(max/100)*6;
        container.attr("height", height);

        function x(d) {
            return (d-1)%tableDim*boxDim;
        }

        function y(d) {
            return Math.floor((d-1)/tableDim)*boxDim + Math.floor((d-1)/100)*6;
        }

        var rect = container.selectAll("g")
                            .data(data)
                            .enter().append("g");

        rect.append("rect")
            .attr("x", function(d) {return x(d.number)+boxDim*margin;})
            .attr("y", function(d) {return y(d.number)+boxDim*margin;})
            .attr("width", boxDim*(1-2*margin))
            .attr("height", boxDim*(1-2*margin))
            .attr("fill", "none")
            .attr("stroke-width", 1)
            .attr("stroke", "black")
            .attr("shape-rendering", "crisp-edges");
        
        rect.append("text")
            .attr("x", function(d) {return x(d.number)+boxDim/2;})
            .attr("y", function(d) {return y(d.number)+boxDim/2;})
            .text(function(d) {return d.number;})
            .style("text-anchor", "middle")
            .style("alignment-baseline", "central");
    });
}
