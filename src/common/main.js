window.onload = function() {
    var sections = setUpNav();
    var container = document.getElementsByClassName("solution-container")[0];
    layout(container.firstElementChild, 20, 30);
    container.style.display = "block";
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

window.showMenu = (function () {
    var active = null;

    function expand(el, size) {
        el.classList.add("active");
        var popup = el.getElementsByClassName("solution-content")[0];
        var curr = el.nextElementSibling;

        curr.addEventListener("transitionend", function(e) {
            if(el == active) {
                popup.classList.add("visible");
                popup.style.left = "-"+el.style.left;
            }
            e.target.removeEventListener(e.type, arguments.callee);
        });

        popup.classList.add("visible");
        var trans = "translateY("+(popup.offsetHeight+size)+"px)";
        popup.classList.remove("visible");
        window.scrollX;

        while(curr) {
            curr.style.transform = trans;
            curr = curr.nextElementSibling;
        }

    }

    function hide(el) {
        el.classList.remove("active");
        var popup = el.getElementsByClassName("solution-content")[0];
        popup.classList.remove("visible");

        var curr = el.nextElementSibling;
        while(curr) {
            curr.style.transform = "translateY(0px)";
            curr = curr.nextElementSibling;
        }
    }

    function toggle(el) {
        if(el.classList.contains("active")) {
            hide(el);
            active = null;
        }
        else {
            if (active)
                hide(active);

            active = el;
            expand(el, 30);
        }
    }

    return toggle;
})();

window.layout = function(el, rowCount, size) {
    var curr = el; 
    while(curr && curr.classList.contains("solution")) {
        var id = Number(curr.firstElementChild.getElementsByTagName("SPAN")[0].textContent);
        curr.style.left = String(((id-1) % rowCount) * size) + "px";
        curr.style.top = String((Math.floor((id-1) / rowCount)) * size + 5 * Math.floor((id - 1) / 100)) + "px";
        curr = curr.nextElementSibling;
    }
}

