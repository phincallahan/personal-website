var currentSection;

function setActiveSection(sectionObj) {
	if(currentSection != sectionObj) {
		currentSection.toggle();
		currentSection = sectionObj;
		currentSection.toggle();
		window.location.replace('#'+sectionObj.key);
	}
}

function findSection(element) {
	return (element.key == this);
}

window.onload = function() {
	var headerElements = document.querySelectorAll("header li");
	var sections = [];

	for(var i = 0; i < headerElements.length; i++)	{
		sections.push({
			key: headerElements[i].textContent,
			elements: [ headerElements[i],
						document.querySelector("#"+headerElements[i].textContent)],
			toggle: function() {
				this.elements.forEach(function(element) {
					element.classList.toggle('current');
				})
			}
		});
	}

	if(window.location.hash) 
		currentSection = sections.find(findSection, window.location.hash.substring(1));
	else 
		currentSection = sections[0];

	currentSection.toggle();

	for(var i = 0; i < headerElements.length; i++) {
		headerElements[i].addEventListener('click', function(event) {
			setActiveSection(sections.find(findSection, this.textContent));
		});
	}
}
