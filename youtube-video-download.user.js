// ==UserScript==
// @name           YouTube Video Download
// @namespace      sooaweso.me
// @description    Download videos from YouTube. Simple, lightweight and supports all formats, including WebM.
// @version        4.0
// @author         rossy
// @license        MIT License
// @grant          none
// @include        http://*.youtube.com/watch?*
// @include        https://*.youtube.com/watch?*
// @include        http://*.c.youtube.com/videoplayback?*
// ==/UserScript==

(function() {
 "use strict";

 function formatSize(bytes)
 {
  if (bytes < 1048576)
   return (bytes / 1024).toFixed(1) + " KiB";
  else
   return (bytes / 1048576).toFixed(1) + " MiB";
 }

 document.addEventListener("ytd-update-link", function(event) {
  if (window.chrome)
  {
   var xhr = new XMLHttpRequest();
   var data = JSON.parse(event.data);
   var set = false;

   xhr.open("HEAD", data.href, true);
   xhr.onreadystatechange = function(e) {
    if (xhr.readyState >= 2)
    {
     if (!set)
     {
      set = true;

      var length = xhr.getResponseHeader("Content-length");
      var target = document.getElementById(data.target);
      target.setAttribute("title", target.getAttribute("title") + ", " + formatSize(Number(length)));
     }

     xhr.abort();
    }
   };
   xhr.send(null);
  }
 }, false);

 function script()
 {
  var version = 4.0, hash = "a6ec775";
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
 return encodeURIComponent(str).replace(/ /g, "%20");
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
  getExtension: getExtension,
 };
 // Just in case the auto format detection code breaks, fall back on these
 // defaults for determining what is in the streams.
 var defaultStreams = [
  { itag: 5 , width: 320, height: 240, container: "FLV" , acodec:"MP3" , vcodec: "H.263" },
  { itag: 17 , width: 176, height: 144, container: "3GPP", acodec:"AAC" , vcodec: "MPEG-4" },
  { itag: 18 , width: 640, height: 360, container: "MP4" , acodec:"AAC" , vcodec: "H.264" , vprofile: "Baseline", level: 3.0 },
  { itag: 22 , width: 1280, height: 720, container: "MP4" , acodec:"AAC" , vcodec: "H.264" , vprofile: "High" , level: 3.1 },
  { itag: 34 , width: 640, height: 360, container: "FLV" , acodec:"AAC" , vcodec: "H.264" , vprofile: "Main" },
  { itag: 35 , width: 854, height: 480, container: "FLV" , acodec:"AAC" , vcodec: "H.264" , vprofile: "Main" },
  { itag: 36 , width: 320, height: 240, container: "3GPP", acodec:"AAC" , vcodec: "MPEG-4", vprofile: "Simple" },
  { itag: 37 , width: 1920, height: 1080, container: "MP4" , acodec:"AAC" , vcodec: "H.264" , vprofile: "High" , level: 3.1 },
  { itag: 38 , width: 2048, height: 1536, container: "MP4" , acodec:"AAC" , vcodec: "H.264" , vprofile: "High" , level: 3.1 },
  { itag: 43 , width: 640, height: 360, container: "WebM", acodec:"Vorbis", vcodec: "VP8" },
  { itag: 44 , width: 854, height: 480, container: "WebM", acodec:"Vorbis", vcodec: "VP8" },
  { itag: 45 , width: 1280, height: 720, container: "WebM", acodec:"Vorbis", vcodec: "VP8" },
  { itag: 46 , width: 1920, height: 1080, container: "WebM", acodec:"Vorbis", vcodec: "VP8" },
  { itag: 82 , width: 640, height: 360, container: "MP4" , acodec:"AAC" , vcodec: "H.264" , vprofile: "Baseline", level: 3.0, stereo3d: true },
  { itag: 83 , width: 854, height: 480, container: "MP4" , acodec:"AAC" , vcodec: "H.264" , vprofile: "Baseline", level: 3.1, stereo3d: true },
  { itag: 84 , width: 1280, height: 720, container: "MP4" , acodec:"AAC" , vcodec: "H.264" , vprofile: "High", level: 3.1, stereo3d: true },
  { itag: 85 , width: 1920, height: 1080, container: "MP4" , acodec:"AAC" , vcodec: "H.264" , vprofile: "High", level: 3.1, stereo3d: true },
  { itag: 100, width: 640, height: 360, container: "WebM", acodec:"Vorbis", vcodec: "VP8" , stereo3d: true },
  { itag: 101, width: 854, height: 480, container: "WebM", acodec:"Vorbis", vcodec: "VP8" , stereo3d: true },
  { itag: 102, width: 1280, height: 720, container: "WebM", acodec:"Vorbis", vcodec: "VP8" , stereo3d: true },
 ];
 function containerToNum(container)
 {
  return {
   "MP4": 1,
   "FLV": 2,
   "WebM": 3,
   "3GPP": 4,
  }[container] || 5;
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
      ret = { container: "Unknown" };
  if (m == "video/mp4")
  {
   ret.container = "MP4";
   ret.vcodec = "H.264";
   ret.acodec = "AAC";
   var m = type.match(/avc1\.(....)(..)/)
   if (m)
   {
    ret.level = parseInt(m[2], 16) / 10;
    if (m[1] == "58A0")
     ret.vprofile = "Extended";
    else if (m[1] == "6400")
     ret.vprofile = "High";
    else if (m[1] == "4D40")
     ret.vprofile = "Main";
    else if (m[1] == "42E0")
     ret.vprofile = "Baseline";
    else if (m[1] == "4200")
     ret.vprofile = "Baseline";
   }
  }
  else if (m == "video/webm")
  {
   ret.container = "WebM";
   ret.vcodec = "VP8";
   ret.acodec = "Vorbis";
  }
  else if (m == "video/x-flv")
  {
   ret.container = "FLV";
  }
  else if (m == "video/3gpp")
  {
   ret.container = "3GPP";
   ret.vcodec = "MPEG-4";
   ret.acodec = "AAC";
  }
  return ret;
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
       streams = equi("itag", defaultStreams, flashArgs.url_encoded_fmt_stream_map.split(",").map(decodeQuery));
   try {
    streams = equi("itag", streams, flashArgs.fmt_list.split(",").map(decodeFormat));
   }
   catch (e) {}
  } catch (e) {}
  return streams.map(processStream);
 }
 // getURL(stream) - Get a URL from a stream
 function getURL(stream, title)
 {
  if (stream.url)
  {
   var uri = new URI(stream.url);
   if (!uri.query.signature && stream.sig)
    uri.query.signature = stream.sig;
   if (title)
    uri.query.title = formatFileName(title);
   return uri.toString();
  }
 }
 function getExtension(stream)
 {
  return {
   "MP4": ".mp4",
   "WebM": ".webm",
   "3GPP": ".3gp",
   "FLV": ".flv",
  }[stream.container] || "";
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
 var nextId = 0;
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
 function formatTitle(stream)
 {
  return (stream.vcodec ? stream.vcodec + "/" + stream.acodec : "") +
   (stream.vprofile ? " (" + stream.vprofile + (stream.level ? "@L" + stream.level.toFixed(1) : "") + ")" : "");
 }
 function updateLink(href, target)
 {
  var data = { "href": href, target: target };
  var event = document.createEvent("MessageEvent");
  event.initMessageEvent("ytd-update-link", true, true, JSON.stringify(data), document.location.origin, "", window);
  document.dispatchEvent(event);
 }
 // createMenuItemGroup() - Creates a sub-group for a set of related streams
 function createMenuItemGroup(streams)
 {
  var itemGroup = document.createElement("div"),
      size = document.createElement("div"),
      mainLink = document.createElement("a"),
      mainId = nextId ++;
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
  var mainTitle = formatFileName(format("${author} - ${title}", merge(streams[0], VideoInfo)));
  mainLink.className = "yt-uix-button-menu-item";
  mainLink.setAttribute("id", "ytd-" + mainId);
  mainLink.setAttribute("href", StreamMap.getURL(streams[0], mainTitle));
  mainLink.setAttribute("download", mainTitle + StreamMap.getExtension(streams[0]));
  mainLink.setAttribute("title", formatTitle(streams[0]));
  updateLink(StreamMap.getURL(streams[0]), "ytd-" + mainId);
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
   var subLink = document.createElement("a"),
       subTitle = formatFileName(format("${author} - ${title}", merge(streams[i], VideoInfo))),
       subId = nextId ++;
   subLink.className = "yt-uix-button-menu-item";
   subLink.setAttribute("id", "ytd-" + subId);
   subLink.setAttribute("href", StreamMap.getURL(streams[i], subTitle));
   subLink.setAttribute("download", subTitle + StreamMap.getExtension(streams[i]));
   subLink.setAttribute("title", formatTitle(streams[i]));
   updateLink(StreamMap.getURL(streams[i]), "ytd-" + subId);
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
  var title = formatFileName(format("${author} - ${title}", merge(stream, VideoInfo)));
  self.dlButton.getElementsByTagName("button")[0]
   .setAttribute("title", T("download-button-tip") +
   " (" + stream.height + "p " + stream.container + ")");
  self.dlButton.setAttribute("href", StreamMap.getURL(stream, title));
  self.dlButton.setAttribute("download", title + StreamMap.getExtension(stream));
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
