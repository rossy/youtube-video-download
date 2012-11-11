"use strict";

var tabFuncs = {};

function createTab(tab, id, links, pages)
{
	var link = tab.querySelector("a"),
	    name = link.getAttribute("href").substr(1),
	    page = document.getElementById(name);

	//page.querySelector("h3").style.display = "none";

	links[id] = link;
	pages[id] = page;

	link.addEventListener("click", tabFuncs[name] = function() {
		for (var i = 0, max = links.length; i < max; i ++)
			links[i].className = links[i].className.replace(/( |^)active( |$)/, "");

		for (var i = 0, max = pages.length; i < max; i ++)
			pages[i].style.display = "none";

		link.className += " active";
		page.style.display = "";
	}, false);

	page.style.display = "none";
}

function createTabBar(tabBar)
{
	var tabs = tabBar.getElementsByTagName("li"),
	    links = [],
	    pages = [];

	for (var i = 0, max = tabs.length; i < max; i ++)
		createTab(tabs[i], i, links, pages);

	links[0].className += "active";
	pages[0].style.display = "";
}

var tabBars = document.querySelectorAll(".tabs");

for (var i = 0, max = tabBars.length; i < max; i ++)
	createTabBar(tabBars[i]);

if (window.opera && !window.opera.getAttribute)
	tabFuncs["opera"]();
else if (window.chrome && !window.chrome.getAttribute)
	tabFuncs["chrome"]();

if (tabFuncs[document.location.hash.substr(1)])
	tabFuncs[document.location.hash.substr(1)]();
