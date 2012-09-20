// ==UserScript==
// @name           YouTube Video Download
// @namespace      sooaweso.me
// @description    Download videos from YouTube. Simple, lightweight and supports all formats, including WebM.
// @version        4.0
// @author         rossy
// @license        MIT License
// @include        http://*.youtube.com/watch?*
// @include        https://*.youtube.com/watch?*
// ==/UserScript==

(function() {
 "use strict";

 function script()
 {
  var version = 4.0, hash = "397b4c8";
// -- Object tools --
// has(obj, key) - Does the object contain the given key?
var has = Function.call.bind(Object.prototype.hasOwnProperty);
// extend(obj, a, b, c, ...) - Add the properties of other objects to this
// object
function extend(obj)
{
 for (var i = 1, max = arguments.length; i < max; i ++)
  for (var key in arguments[i])
   if (has(arguments[i], key))
    obj[key] = arguments[i][key];
 return obj;
}
// merge(a, b, c, ...) - Create an object with the merged properties of other
// objects
function merge()
{
 return extend.bind(null, {}).apply(null, arguments);
}
var copy = merge;
// -- Array tools --
// arrayify(a) - Turn an array-like object into an array
var slice = Function.call.bind(Array.prototype.slice),
    arrayify = slice;
// index(on, a) - Index an array of objects by a key
function index(on, a)
{
 var obj = {};
 for (var i = 0, max = a.length; i < max; i ++)
  if (a[i].has(on))
   obj[a[i][on]] = a[i];
 return obj;
}
// pluck(on, a) - Return a list of property values
function pluck(on, a)
{
 return a.map(function(o) { return o[on]; });
}
// indexpluck(on, a) - Index and pluck
function indexpluck(key, value, a)
{
 var obj = {};
 for (var i = 0, max = a.length; i < max; i ++)
  if (a[i].has(key))
   obj[a[i][key]] = a[i][value];
 return obj;
}
// equi(on, a, b, c, ...) - Performs a equijoin on all the objects in the given
// arrays
function equi(on)
{
 var obj = {}, ret = [];
 for (var i = 1, imax = arguments.length; i < imax; i ++)
  for (var j = 0, jmax = arguments[i].length; j < jmax; j ++)
   if (has(arguments[i][j], on))
    obj[arguments[i][j][on]] = merge(obj[arguments[i][j][on]] || {}, arguments[i][j])
 for (var prop in obj)
  if (has(obj, prop))
   ret.push(obj[prop]);

 return ret;
}

// -- URI tools --

// decodeURIPlus(str) - Decode a URI component, including conversion from '+'
// to ' '
function decodeURIPlus(str)
{
 return decodeURIComponent(str.replace(/\+/g, " "));
}

// encodeURIPlus(str) - Encode a URI component, including conversion from ' '
// to '+'
function encodeURIPlus(str)
{
 return encodeURIComponent(str).replace(/ /g, "+");
}

// decodeQuery(query) - Convert a query string to an object
function decodeQuery(query)
{
 var obj = {};

 query.split("&").forEach(function(str) {
  var m = str.match(/^([^=]*)=(.*)$/);

  if (m)
   obj[decodeURIPlus(m[1])] = decodeURIPlus(m[2]);
  else
   obj[decodeURIPlus(str)] = "";
 });

 return obj;
}

// encodeQuery(query) - Convert a query string back into a URI
function encodeQuery(query)
{
 var components = [];

 for (var name in query)
  if (has(query, name))
   components.push(encodeURIPlus(name) + "=" + encodeURIPlus(query[name]));

 return components.join("&");
}

// URI(uri) - Convert a URI to a mutable object
function URI(uri)
{
 if (!(this instanceof URI))
  return new URI(uri);

 var m = uri.match(/([^\/]+)\/\/([^\/]+)([^?]*)(?:\?(.+))?/);

 if (m)
 {
  this.protocol = m[1];
  this.host = m[2];
  this.pathname = m[3];
  this.query = m[4] ? decodeQuery(m[4]) : {};
 }
 else
 {
  this.href = uri;
  this.query = {};
 }
}
URI.prototype.toString = function() {
 if (this.href)
  return this.href;

 var encq = this.query && encodeQuery(this.query);

 return (this.protocol || "http") + "//" + this.host + this.pathname + (encq ? "?" + encq : "");
};

// -- Function tools --

function identity(a) { return a; }

// runWith - Run JavaScript code with an object's properties as local variables
function runWith(str, obj)
{
 var names = [],
     values = [];

 for (var name in obj)
  if (has(obj, name))
  {
   names.push(name);
   values.push(obj[name]);
  }

 var func = Function.apply(null, names.concat(str));

 return func.apply(null, values);
}

// -- String tools --

// format(str, obj) - Formats a string with a syntax similar to Python template
// strings, except the identifiers are executed as JavaScript code.
function format(str, obj)
{
 return str.replace(/\${([^}]+)}/g, function(match, name) {
  try {
   return runWith("return (" + name + ");", obj);
  }
  catch (e) {
   return match;
  }
 });
}

// trim(str) - Trims whitespace from the start and end of the string.
function trim(str)
{
 return str.replace(/^\s+/, "").replace(/\s+$/, "");
}

// formatFileName(str) - Formats a file name (sans extension) to obey certain
// restrictions on certain platforms. Makes room for a 4 character extension,
// ie. ".webm".
function formatFileName(str)
{
 return str
  .replace(/[\\/<>:"\?\*\|]/g, "-")
  .replace(/[\x00-\x1f]/g, "-")
  .replace(/^\./g, "-")
  .replace(/^\s+/, "")
  .substr(0, 250);
}
// Try - Do things or do other things if they don't work
var Try = (function() {
 var self = {
  all: all,
 };
 function all()
 {
  var args = Array.prototype.slice(arguments),
   arg;
  for (var i = 0, imax = arguments.length; i < imax; i ++)
   if (arguments[i] instanceof Array)
    for (var j = 0, jmax = arguments[i].length; j < jmax; j ++)
     try {
      return arguments[i][j]();
     }
     catch (e) {}
   else
    try {
     return arguments[i]();
    }
    catch (e) {}
 }
 return self;
})();
// VideoInfo - Get global video metadata
var VideoInfo = (function() {
 var self = {
  init: init,
 };
 // init() - Populates the VideoInfo object with video metadata
 function init()
 {
  self.title = Try.all(
   function() {
    return yt.playerConfig.args.title;
   },
   function() {
    return document.querySelector("meta[name=title]").getAttribute("content");
   },
   function() {
    return document.querySelector("meta[property=\"og:title\"]").getAttribute("content");
   },
   function() {
    return document.getElementById("eow-title").getAttribute("title");
   },
   function() {
    return document.title.match(/^(.*) - YouTube$/)[1];
   }
  );
  self.author = Try.all(
   function() {
    return document.querySelector("#watch-uploader-info > .author").textContent;
   },
   function() {
    return document.querySelector("#watch-userbanner").getAttribute("title");
   },
   function() {
    return document.querySelector("span[itemprop=author] > link[itemprop=url]").getAttribute("href").match(/www.youtube.com\/user\/([^\/]+)/)[1];
   }
  );
 }
 return self;
})();
var Languages = {
 "en": {"download-button-tip": "Download this video","download-button-text": "Download","menu-button-tip": "Choose from additional formats","group-high-definition": "High definition","group-standard-definition": "Standard definition","group-mobile": "Mobile","group-unknown": "Unknown formats","error-no-downloads": "No downloadable streams found"},
};
Languages.current = Languages.en;
function T(item) { return Languages.current[item] || Languages.en[item]; }
// StreamMap - Get and convert format maps
var StreamMap = (function() {
 var self = {
  getStreams: getStreams,
  getURL: getURL,
  sortFunc: sortFunc,
 };
 function containerToNum(container)
 {
  return {
   "MP4": 1,
   "FLV": 2,
   "WebM": 3,
   "3GPP": 4,
  }[container] || 0;
 }
 // sortFunc(a, b) - Sort streams from best to worst
 function sortFunc(a, b)
 {
  if (a.height && b.height && a.height != b.height)
   return b.height - a.height;
  if (a.stereo3d && !b.stereo3d)
   return 1;
  else if (!a.stereo3d && b.stereo3d)
   return -1;
  if (a.container && b.container && a.container != b.container)
   return containerToNum(a.container) - containerToNum(b.container);
  return (Number(b.itag) - Number(a.itag)) || 0;
 }
 // decodeType(type) - Decode the mime type of the video
 function decodeType(type)
 {
  var m = type.match(/^[^ ;]*/)[0],
      container = "Unknown", vcodec, acodec, vprofile, level;
  if (m == "video/mp4")
  {
   container = "MP4";
   vcodec = "H.264";
   acodec = "AAC";
   var m = type.match(/avc1\.(....)(..)/)
   if (m)
   {
    level = parseInt(m[2], 16) / 10;
    if (m[1] == "58A0")
     vprofile = "Extended";
    else if (m[1] == "6400")
     vprofile = "High";
    else if (m[1] == "4D40")
     vprofile = "Main";
    else if (m[1] == "42E0")
     vprofile = "Baseline";
    else if (m[1] == "4200")
     vprofile = "Baseline";
   }
  }
  else if (m == "video/webm")
  {
   container = "WebM";
   vcodec = "VP8";
   acodec = "Vorbis";
  }
  else if (m == "video/x-flv")
  {
   container = "FLV";
  }
  else if (m == "video/3gpp")
  {
   container = "3GPP";
   vcodec = "MPEG-4";
   acodec = "AAC";
  }
  return {
   container: container,
   acodec: acodec,
   vcodec: vcodec,
   vprofile: vprofile,
   level: level,
  };
 }
 // processStream(stream) - Add some format information to the stream
 function processStream(stream)
 {
  if (stream.type)
  {
   stream = merge(stream, decodeType(stream.type));
   if (stream.container == "FLV")
    if (stream.flashMajor == 7)
    {
     stream.vcodec = "H.263";
     stream.acodec = "MP3";
    }
    else
    {
     stream.vcodec = "H.264";
     stream.acodec = "AAC";
    }
  }
  return stream;
 }
 // decodeFormat(format) - Decode an element of the fmt_list array
 function decodeFormat(format)
 {
  format = format.split("/");
  var size = format[1].split("x");
  return {
   itag: format[0],
   width: Number(size[0]),
   height: Number(size[1]),
   flashMajor: Number(format[2]),
   flashMinor: Number(format[3]),
   flashPatch: Number(format[4]),
  };
 }
 // getFlashArgs() - Get the flashvars from the page
 function getFlashArgs()
 {
  return Try.all(
   function() {
    return yt.playerConfig.args;
   },
   function() {
    return decodeQuery(document.getElementById("movie_player").getAttribute("flashvars"));
   }
  );
 }
 // getStreams() - Get the streams from the page
 function getStreams()
 {
  try {
   var flashArgs = getFlashArgs(),
       streams = flashArgs.url_encoded_fmt_stream_map.split(",").map(decodeQuery);
   try {
    streams = equi("itag", streams, flashArgs.fmt_list.split(",").map(decodeFormat));
   }
   catch (e) {}
  } catch (e) {}
  return streams.map(processStream);
 }
 // getURL(stream) - Get a URL from a stream
 function getURL(stream)
 {
  if (stream.url)
  {
   var uri = new URI(stream.url);
   if (!uri.query.signature && stream.sig)
    uri.query.signature = stream.sig;
   uri.query.title = formatFileName(format("${author} - ${title}", merge(stream, VideoInfo)));
   return uri.toString();
  }
 }
 return self;
})();
// Interface - Handles the user interface for the watch page
var Interface = (function() {
 var self = {
  init: init,
  update: update,
 };
 var groups = [
  { title: T("group-high-definition"), predicate: function(stream) {
   return stream.height && stream.container && stream.container != "3GPP" && stream.height > 576;
  } },
  { title: T("group-standard-definition"), predicate: function(stream) {
   return stream.height && stream.container && stream.container != "3GPP" && stream.height <= 576;
  } },
  { title: T("group-mobile"), predicate: function(stream) {
   return stream.height && stream.container && stream.container == "3GPP";
  } },
  { title: T("group-unknown"), flat: true, predicate: function(stream) {
   return !stream.height || !stream.container;
  } },
 ];
 // createDlButton() - Creates the instant download button
 function createDlButton()
 {
  var link = document.createElement("a"),
      elem = document.createElement("button");
  link.setAttribute("href", "javascript:;");
  elem.className = "start yt-uix-tooltip-reverse yt-uix-button yt-uix-button-default yt-uix-tooltip";
  elem.setAttribute("title", T("download-button-tip"));
  elem.setAttribute("type", "button");
  elem.setAttribute("role", "button");
  elem.innerHTML = "<span class=\"yt-uix-button-content\">" + T("download-button-text") + "</span>";
  link.appendChild(elem);
  return link;
 }
 // createMenuButton() - Creates the download menu button
 function createMenuButton()
 {
  var elem = document.createElement("button");
  elem.className = "end yt-uix-tooltip-reverse yt-uix-button yt-uix-button-default yt-uix-tooltip";
  elem.setAttribute("title", T("menu-button-tip"));
  elem.setAttribute("type", "button");
  elem.setAttribute("role", "button");
  elem.setAttribute("onclick", "; return false;");
  elem.innerHTML = "<img class=\"yt-uix-button-arrow\" style=\"margin: 0;\" src=\"//s.ytimg.com/yt/img/pixel-vfl73.gif\" alt=\"\">";
  return elem;
 }
 // createMenu() - Creates the downloads menu
 function createMenu()
 {
  var elem = document.createElement("div");
  elem.className = "yt-uix-button-menu";
  elem.style.display = "none";
  return elem;
 }
 // createMenuItemGroup() - Creates a sub-group for a set of related streams
 function createMenuItemGroup(streams)
 {
  var itemGroup = document.createElement("div"),
      size = document.createElement("div"),
      mainLink = document.createElement("a");
  itemGroup.style.position = "relative";
  itemGroup.style.minWidth = streams.length * 64 + 48 + "px";
  itemGroup.addEventListener("mouseover", function() {
   itemGroup.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
  }, false);
  itemGroup.addEventListener("mouseout", function() {
   itemGroup.style.backgroundColor = "";
  }, false);
  size.className = "yt-uix-button-menu-item";
  size.style.textAlign = "right";
  size.style.width = "55px";
  size.style.position = "absolute";
  size.style.left = "0px";
  size.style.top = "0px";
  size.style.paddingLeft = size.style.paddingRight = "0px";
  size.style.color = "inherit";
  mainLink.className = "yt-uix-button-menu-item";
  mainLink.setAttribute("href", StreamMap.getURL(streams[0]));
  mainLink.style.display = "block";
  mainLink.style.paddingLeft = "55px";
  mainLink.style.marginRight = (streams.length - 1) * 64 + "px";
  mainLink.addEventListener("contextmenu", function(e) {
   // Prevent right-click closing the menu in Chrome
   e.stopPropagation();
  }, false);
  size.appendChild(document.createTextNode(streams[0].height + "p\u00a0"));
  mainLink.appendChild(size);
  mainLink.appendChild(document.createTextNode((streams[0].stereo3d ? "3D " : "") + streams[0].container));
  itemGroup.appendChild(mainLink);
  for (var i = 1, max = streams.length; i < max; i ++)
  {
   var subLink = document.createElement("a");
   subLink.className = "yt-uix-button-menu-item";
   subLink.setAttribute("href", StreamMap.getURL(streams[i]));
   subLink.style.display = "block";
   subLink.style.position = "absolute";
   subLink.style.right = (streams.length - i - 1) * 64 + "px";
   subLink.style.top = "0px";
   subLink.style.width = "53px";
   subLink.style.paddingLeft = subLink.style.paddingRight = "5px";
   subLink.style.borderLeft = "1px solid #DDD";
   subLink.addEventListener("contextmenu", function(e) {
    // Prevent right-click closing the menu in Chrome
    e.stopPropagation();
   }, false);
   subLink.appendChild(document.createTextNode((streams[i].stereo3d ? "3D " : "") + streams[i].container));
   itemGroup.appendChild(subLink);
  }
  return itemGroup;
 }
 // createGroup(title, streams) - Creates a new menu group
 function createGroup(title, flat, streams)
 {
  var elem = document.createElement("div");
  elem.innerHTML = "<div style=\"padding: 2px 13px; font-weight: bold; border-bottom: 1px solid #999;\">" + title + "</div>";
  if (flat)
   for (var i = 0, max = streams.length; i < max; i ++)
    elem.appendChild(createMenuItemGroup([streams[i]]));
  else
  {
   var resolutions = [],
       resGroups = {};
   for (var i = 0, max = streams.length; i < max; i ++)
   {
    if (!resGroups[streams[i].height])
    {
     resolutions.push(streams[i].height);
     resGroups[streams[i].height] = [];
    }
    resGroups[streams[i].height].push(streams[i]);
   }
   for (var i = 0, max = resolutions.length; i < max; i ++)
    elem.appendChild(createMenuItemGroup(resGroups[resolutions[i]]));
  }
  return elem;
 }
 // setDlButton(stream) - Sets the default stream to download
 function setDlButton(stream)
 {
  self.dlButton.getElementsByTagName("button")[0]
   .setAttribute("title", T("download-button-tip") +
   " (" + stream.height + "p " + stream.container + ")");
  self.dlButton.setAttribute("href", StreamMap.getURL(stream));
 }
 // update(streams) - Adds streams to the menu
 function update(streams)
 {
  streams = streams
   .filter(function(obj) { return obj.url; })
   .sort(StreamMap.sortFunc);
  var mp4streams = streams.filter(function(obj) { return obj.container == "MP4"; });
  if (mp4streams.length)
   setDlButton(mp4streams[0]);
  else if (streams.length)
   setDlButton(streams[0]);
  else
  {
   var button = self.dlButton.getElementsByTagName("button")[0];
   self.menuButton.disabled = true;
   self.menuButton.setAttribute("title", "");
   button.setAttribute("title", T("error-no-downloads"));
  }
  for (var i = 0, max = groups.length; i < max; i ++)
  {
   var groupStreams = streams.filter(groups[i].predicate);
   if (groupStreams.length)
    self.menu.appendChild(createGroup(groups[i].title, groups[i].flat, groupStreams));
  }
 }
 // init() - Initalises the user interface
 function init()
 {
  // Get the flag button from the actions menu
  var watchFlag = document.getElementById("watch-flag"),
      buttonGroup = document.createElement("span");
  buttonGroup.className = "yt-uix-button-group";
  self.dlButton = createDlButton();
  self.menuButton = createMenuButton();
  self.menu = createMenu();
  self.menuButton.appendChild(self.menu);
  // If the flag button is disabled, all the controls should be disabled
  self.dlButton.disabled = self.menuButton.disabled = watchFlag.disabled;
  // Populate the button group
  buttonGroup.appendChild(self.dlButton);
  buttonGroup.appendChild(self.menuButton);
  // Insert the button group before the flag button
  watchFlag.parentNode.insertBefore(buttonGroup, watchFlag);
  // Also insert some whitespace
  watchFlag.parentNode.insertBefore(document.createTextNode(" "), watchFlag);
 }
 return self;
})();
function setLanguage(language)
{
 if (Languages[language])
  Languages.current = Languages[language];
}
function main()
{
 setLanguage(document.documentElement.getAttribute("lang"));
 VideoInfo.init();
 Interface.init();
 Interface.update(StreamMap.getStreams());
}
  main();
 }
 function inject(str)
 {
  var elem = document.createElement("script");
  elem.setAttribute("type", "application/javascript");
  elem.textContent = "(function() {\"use strict\"; (" + str + ")();})();";
  document.body.appendChild(elem);
 }
 inject(script);
})();
