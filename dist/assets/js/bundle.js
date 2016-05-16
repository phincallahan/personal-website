(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var currentSection;

function setActiveSection(sectionObj) {
	if(currentSection != sectionObj) {
		currentSection.toggle();
		currentSection = sectionObj;
		currentSection.toggle();
		window.location.replace('#'+sectionObj.key);
	}    
    console.log(window.scrollY);
    window.scrollTo(0, 0);
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

},{}]},{},[1]);
