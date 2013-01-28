// ==UserScript==
// @name           YouTube Video Download
// @namespace      http://rossy2401.blogspot.com/
// @description    Download videos from YouTube. Simple, lightweight and supports all formats, including WebM.
// @version        4.1.1
// @author         rossy
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACC0lEQVR4Xu3TT2sTURQF8LtR88eMTgU/gOA3UNwoaLtw6yJYcaeCC3Er7hT3VlGhCMaC4CIoFAKKtqJYQ8XguOgEk0WCk8AsMsUsEmigSeF4Lg9KCMTORGm6yIXfu8Od+w6BJDKpiT2jMJW8SR/JIVUn/Cf1vtxFOi399Y1Dwi7LitbXqWSaMCZpydvJLGFMsrJiJwqEMSnIJzvhE8bElw92YosQVq/XQ1d1u+h1TTfMnDtRbMn7wwlE0el0BmxoNzY6iJonb3lE0W610Wq32Vumt1vKzDmLmic5HlE0m80hfmtH1DxZ5DGUncTn9AWsXEpvC4IGgkaARtAg0wP2wPTtvS+XL+pdzRieT/L6UBzDvLJiyJ6fge/7I+FdzdCsoSTL428epw7g7sw5eLUaPE95qNVUzfAMzviOzAx3eEfv7pQvL3ns5AGDbp06iZ9ra6hWKqgMqppeJe5w94TeQZhsecEjjIepGG4cP4bV5SWUS2WUy6qEknYDq0vLuqO7CJsrC1Z8kxDGEwZfP3oEuecZuEUXrltE0XUVcgsZfac7uhvWpjyz4nVCWPP6IeL7cP/aVfxwvsNxHD5f0Zm+050ofslTK54nRHU7wd/F2TNKn3U2irzMW7EMYRT3Du5XOhtVRvidTRPGZFq0HqVic4RdNif9xb/OLL0hp8864R+tD2S+o1nZKzUxqT/sC28zrWX8pAAAAABJRU5ErkJggg==
// @license        MIT License
// @grant          none
// @updateURL      https://userscripts.org/scripts/source/62634.user.js
// @include        https://userscripts.org/scripts/source/62634.meta.js
// @include        http://www.youtube.com/watch?*
// @include        https://www.youtube.com/watch?*
// @include        http://*.c.youtube.com/videoplayback?*
// ==/UserScript==

/*
 * This file is a part of YouTube Video Download, which has been placed under
 * the MIT/Expat license.
 *
 * Copyright (c) 2012-2013, James Ross-Gowan and other contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

/*
 * Feel free to read and modify this source code, however please note that this
 * is the compiled/pre-processed version of the script. It has been generated
 * from several files and most whitespace has been removed. For easier reading,
 * see the GitHub repository:
 * https://github.com/rossy2401/youtube-video-download/tree/stable/src
 *
 * For translations, language files can be found here:
 * https://github.com/rossy2401/youtube-video-download/tree/stable/lang
 */

(function() {
 "use strict";

 function inject(str)
 {
  var elem = document.createElement("script");

  elem.setAttribute("type", "application/javascript");
  elem.textContent = "(function() {\"use strict\"; (" + str + ")();})();";

  document.body.appendChild(elem);
 }

 if (document.location.href == "https://userscripts.org/scripts/source/62634.meta.js")
 {
  inject(function() {
   window.parent.postMessage(document.documentElement.textContent, "*");
  });

  return;
 }

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

  var version = "4.1.1";
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
    return document.querySelector("#watch-headline-title > .yt-uix-expander-head").getAttribute("title");
   },
   function() {
    return document.title.match(/^(.*) - YouTube$/)[1];
   }
  );
  self.author = Try.all(
   function() {
    return document.querySelector("#watch7-user-header > .yt-user-name").textContent;
   },
   function() {
    return document.querySelector("#watch7-user-header .yt-thumb-clip img").getAttribute("alt");
   },
   function() {
    return document.querySelector("span[itemprop=author] > link[itemprop=url]").getAttribute("href").match(/www.youtube.com\/user\/([^\/]+)/)[1];
   }
  );
  self.date = Try.all(
   function() {
    return new Date(document.getElementById("eow-date").textContent);
   }
  );
  self.video_id = Try.all(
   function() {
    return new URI(document.location.href).query.v;
   }
  );
  self.seconds = Try.all(
   function() {
    return Math.floor(Number(yt.playerConfig.args.length_seconds));
   }
  );
  if (self.date)
  {
   self.day = ("0" + self.date.getDate()).match(/..$/)[0];
   self.month = ("0" + (self.date.getMonth() + 1)).match(/..$/)[0];
   self.year = self.date.getFullYear().toString();
   self.date.toString = function() {
    return self.year + "-" + self.month + "-" + self.day;
   };
  }
  if (self.seconds)
   self.duration = Math.floor(self.seconds / 60) + ":" + self.seconds % 60;
 }
 return self;
})();
var Languages = {
 "ar": {"language": "Arabic","credit0-name": "Anas Abu-Haimed","credit0-url": "http://www.3thical.org","download-button-tip": "تحميل هذا الفيديو","download-button-text": "تحميل","menu-button-tip": "اختر الصيغة","format-tip": "الصيغة ","group-options": "الخيارات","group-high-definition": "جودة عالية","group-standard-definition": "جودة متوسطة","group-mobile": "للجوال","group-unknown": "صيغة غير معروفه","group-update": "يوجد تحديثات","option-check": "التأكد من وجود تحديثات","option-webm": "افضل WebM","option-sizes": "الحصول على حجم ملف الفيديو","option-format": "صيغة الفيديو","option-itags": "الصيغ المفضلة","button-options": "خيارات","button-options-close": "اغلاق","button-update": "اضغط هنا لتحديث YouTube Video Download","error-no-downloads": "لايوجد محتوى قابل للتحميل"},
 "cs": {"language": "Czech","credit0-name": "janwatzek","credit0-url": "http://userscripts.org/users/janwatzek","download-button-tip": "Uložit video na pevný disk","download-button-text": "Stáhnout","menu-button-tip": "Vyberte formát ke stažení","group-options": "Nastavení","group-high-definition": "Vysoké rozlišení","group-standard-definition": "Standardní rozlišení","group-mobile": "Mobile","group-unknown": "Neznámý formát","group-update": "Nová verze skriptu YouTube Video Download je dostupná ke stažení!","option-check": "Kontrolovat aktualizace","option-format": "Formát názvu videa","button-options": "nastavení","button-options-close": "close","button-update": "Klikněte sem pro aktualizaci","error-no-downloads": "Žádné formáty nejsou dostupné ke stažení"},
 "de": {"language": "German","credit0-name": "QuHno","credit0-url": "http://userscripts.org/users/348658","download-button-tip": "Video auf der Festplatte speichern","download-button-text": "Download","menu-button-tip": "Weitere Formate wählen","group-options": "Einstellungen","group-high-definition": "Hohe Auflösung","group-standard-definition": "Standard Auflösung","group-mobile": "Mobil","group-unknown": "Unbekanntes Format","group-update": "Eine neue Version steht zur Verfügung","option-check": "Auf neue Version überprüfen","option-webm": "WebM bevorzugen","option-sizes": "Video Dateigröße ermitteln","option-format": "Titel Format","option-itags": "Bevorzugte Formate","button-options": "Einstellungen","button-options-close": "Schließen","button-update": "Hier klicken, um YouTube Video Download zu aktualisieren","error-no-downloads": "Keine herunterladbaren Streams gefunden"},
 "en": {"language": "English","download-button-tip": "Download this video","download-button-text": "Download","menu-button-tip": "Choose from additional formats","format-tip": "Format ","group-options": "Options","group-high-definition": "High definition","group-standard-definition": "Standard definition","group-mobile": "Mobile","group-unknown": "Unknown formats","group-update": "An update is available","option-check": "Check for updates","option-webm": "Prefer WebM","option-sizes": "Get video filesize","option-format": "Title format","option-itags": "Favourite formats","button-options": "options","button-options-close": "close","button-update": "Click here to update YouTube Video Download","error-no-downloads": "No downloadable streams found"},
 "es": {"language": "Spanish","credit0-name": "vorbote","credit0-url": "http://userscripts.org/users/264443","download-button-tip": "Descargar este video","download-button-text": "Descargar","menu-button-tip": "Escoja formatos adicionales","format-tip": "Formato ","group-options": "Opciones","group-high-definition": "Alta definición","group-standard-definition": "Definición estándar","group-mobile": "Móvil","group-unknown": "Formatos desconocidos","group-update": "Hay una actualización disponible","option-check": "Buscar actualizaciones","option-webm": "Preferir WebM","option-sizes": "Obtener el tamaño del video","option-format": "Formato del título","option-itags": "Formatos favoritos","button-options": "opciones","button-options-close": "cerrar","button-update": "Oprima aquí para actualizar YouTube Video Download","error-no-downloads": "No se encontraron archivos descargables"},
 "fr": {"language": "French","credit0-name": "jok-r","credit0-url": "http://userscripts.org/users/87056","download-button-tip": "Télécharger cette vidéo","download-button-text": "Télécharger","menu-button-tip": "Choisissez le format à télécharger","group-options": "Options","group-high-definition": "Haute définition","group-standard-definition": "Définition standard","group-mobile": "Mobile","group-unknown": "Format inconnu","group-update": "Une nouvelle version de YouTube Video Download est disponible","option-check": "Vérifier les mises à jour","option-format": "Format du nom de fichier","button-options": "options","button-options-close": "close","button-update": "Cliquer ici pour mettre à jour maintenant","error-no-downloads": "Pas de formats de téléchargement disponible"},
 "id": {"language": "Indonesian","credit0-name": "Bayu Aditya H","credit0-url": "http://ba.yuah.web.id/?asal=gmytdlfl","download-button-tip": "Unduh video ini","download-button-text": "Unduh","menu-button-tip": "Pilih dari format tambahan","format-tip": "Format ","group-options": "Opsi","group-high-definition": "Definisi tinggi","group-standard-definition": "Definisi standar","group-mobile": "Perangkat bergerak","group-unknown": "Format tak dikenal","group-update": "Perbaruan tersedia","option-check": "Periksa pembaruan","option-webm": "Utamakan WebM","option-sizes": "Dapatkan ukuran video","option-format": "Format judul","option-itags": "Format kesukaan","button-options": "opsi","button-options-close": "tutup","button-update": "Klik di sini untuk memperbarui YouTube Video Download","error-no-downloads": "Tidak ada aliran yang dapat diunduh ditemukan"},
 "it": {"language": "Italian","credit0-name": "Kharg","credit0-url": "http://userscripts.org/users/kharg","download-button-tip": "Salva il video nell'HD","download-button-text": "Scarica","menu-button-tip": "Scegli un formato da scaricare","group-options": "Opzioni","group-high-definition": "Alta definizione","group-standard-definition": "Qualità standard","group-mobile": "Mobile","option-check": "Controlla la disponibilità di aggiornamenti","option-format": "Formato titolo","button-options": "opzioni","button-options-close": "close","error-no-downloads": "Nessun formato da scaricare disponibile"},
 "ja-JP": {"language": "Japanese","credit0-name": "K-M","credit0-url": "http://userscripts.org/users/184613","download-button-tip": "ハードディスクにビデオを保存","download-button-text": "ダウンロード","menu-button-tip": "ダウンロードする形式を選択","group-options": "オプション","group-high-definition": "高画質","group-standard-definition": "普通の画質","group-mobile": "Mobile","group-unknown": "不明な形式","group-update": "YouTube Video Downloadの更新があります","option-check": "更新を確認","option-format": "タイトルの形式","button-options": "オプション","button-options-close": "close","button-update": "ここをクリックすると更新します","error-no-downloads": "ダウンロードできません"},
 "ko": {"language": "Korean","credit0-name": "Joonhyuk Song","credit0-url": "http://blog.naver.com/fprhqkrtk303","download-button-tip": "이 비디오를 다운로드 합니다","download-button-text": "다운로드","menu-button-tip": "파일 형식 고르기","group-options": "설정","group-high-definition": "고화질 (HD)","group-standard-definition": "일반화질 (SD)","group-mobile": "휴대기기용","group-unknown": "알 수 없는 파일 형식","group-update": "업데이트 가능","option-check": "업데이트 확인","option-webm": "WebM 사용하기","option-restrict": "선호하는 파일 형식만 사용","option-sizes": "파일크기 보기","option-format": "제목 형식 설정","button-options": "설정","button-options-close": "닫기","button-update": "YouTube Video Download를 업데이트 하려면 여기를 누르세요","error-no-downloads": "받을 수 있는 스트림이 없습니다"},
 "pl": {"language": "Polish","credit0-name": "look997","credit0-url": "http://userscripts.org/users/123591","download-button-tip": "Zapisz film na twardym dysku","download-button-text": "Pobierz","menu-button-tip": "Wybierz format do pobrania","group-options": "Opcje","group-high-definition": "Wysoka rozdzielczość","group-standard-definition": "Standardowa rozdzielczość","group-mobile": "Mobile","group-unknown": "Nieznany format","group-update": "Nowa wersja YouTube Video Download jest dostępna","option-check": "Sprawdzaj aktualizacje","option-format": "Format tytułu","button-options": "opcje","button-options-close": "close","button-update": "Kliknij tutaj, aby zaktualizować","error-no-downloads": "Nie dostępne formaty"},
 "pt-BR": {"language": "Portuguese (Brazil)","credit0-name": "Gandalf","credit0-url": "http://userscripts.org/users/73303","download-button-tip": "Salvar vídeo","download-button-text": "Salvar","menu-button-tip": "Escolha outros formatos","group-options": "Opções","group-high-definition": "Definição alta","group-standard-definition": "Definição padrão","group-mobile": "Definição celular","group-unknown": "Formatos desconhecidos","group-update": "Nova versão disponível","option-check": "Procurar atualizações","option-webm": "WebM como formato padrão","option-restrict": "Mostrar apenas formato padrão","option-sizes": "Mostrar tamanho do arquivo","option-format": "Formato do Título","button-options": "opções","button-options-close": "fechar","button-update": "Clique aqui para atualizar YouTube Video Download","error-no-downloads": "Nenhum formato disponível para salvar"},
 "ru": {"language": "Russian","credit0-name": "lmiol","credit0-url": "http://userscripts.org/users/121962","credit1-name": "Ареопагит","credit1-url": "http://userscripts.org/users/155252","download-button-tip": "Скачать видео","download-button-text": "Скачать","menu-button-tip": "Выбрать формат для загрузки","format-tip": "Формат ","group-options": "Настройки","group-high-definition": "Высокое разрешение","group-standard-definition": "Стандартное разрешение","group-mobile": "Для телефона","group-unknown": "Неизвестный формат","group-update": "Доступна новая версия YouTube Video Download","option-check": "Проверять обновления","option-webm": "Предпочитать WebM","option-sizes": "Получать размер видеофайла","option-format": "Шаблон имени файла:","option-itags": "Любимые форматы:","button-options": "Настройки","button-options-close": "Скрыть","button-update": "Нажмите здесь для обновления","error-no-downloads": "Нет доступных форматов для загрузки"},
 "sr": {"language": "Serbian","credit0-name": "titanicus","credit0-url": "http://userscripts.org/users/26334","download-button-tip": "Преузми овај видео","download-button-text": "Преузми","menu-button-tip": "Изаберите остале доступне формате","group-options": "Опције","group-high-definition": "Висока резолуција","group-standard-definition": "Стандардна резолуција","group-mobile": "Мобилни","group-unknown": "Непознати формати","group-update": "Надоградња је доступна","option-check": "Провери надоградње","option-webm": "Преферирај WebM","option-sizes": "Добави величину фајла","option-format": "Формат наслова","button-options": "опције","button-options-close": "затвори","button-update": "Кликните овде да ажурирате YouTube Видео Преузимач","error-no-downloads": "Нема доступних формата"},
 "sv": {"language": "Swedish","credit0-name": "eson","credit0-url": "http://userscripts.org/users/367569","download-button-tip": "Ladda ner den här videon","download-button-text": "Ladda ner","menu-button-tip": "Välj mellan olika format","group-options": "Alternativ","group-high-definition": "Högupplöst","group-standard-definition": "Standardupplösning","group-mobile": "Mobilt","group-unknown": "Okända format","group-update": "Det finns en uppdatering tillgänglig","option-check": "Sök efter uppdateringar","option-webm": "Prioritera WebM","option-sizes": "Visa filstorlek","option-format": "Titelformat","option-itags": "Favoritformat","button-options": "Alternativ","button-options-close": "Stäng","button-update": "Klicka här för att uppdatera YouTube Video Download","error-no-downloads": "Det går inte att hitta några nedladdningsbara strömmar"},
 "tr": {"language": "Turkish","credit0-name": "Kenterte","credit0-url": "http://userscripts.org/users/Kenterte","download-button-tip": "Videoyu Farklı Kaydet","download-button-text": "İndir","menu-button-tip": "Bir İndirme Formatı Seçin","group-options": "Ayarlar","group-high-definition": "Yüksek Çözünürlük","group-standard-definition": "Standart Çözünürlük","group-mobile": "Mobile","group-unknown": "Bilinmeyen Format","group-update": "YouTube Video Downloader'ın yeni bir versiyonu var","option-check": "Güncelleştirmeleri Kontrol Et","option-format": "Başlık Türü","button-options": "Ayarlar","button-options-close": "close","button-update": "Güncelleştirmek için tıklayınız","error-no-downloads": "Format Bulunamadı"},
 "zh-TW": {"language": "Chinese (Traditional)","credit0-name": "Wang Zheng","credit0-url": "http://userscripts.org/users/381783","credit1-name": "AlvinHKH","credit1-url": "http://userscripts.org/users/364788","download-button-tip": "下載此影片","download-button-text": "下載","menu-button-tip": "選擇其他格式","format-tip": "格式 ","group-options": "選項","group-high-definition": "高清晰度","group-standard-definition": "標準畫質","group-mobile": "流動電話","group-unknown": "不明格式","group-update": "有可用的更新","option-check": "檢查更新","option-webm": "WebM 優先","option-sizes": "獲取影片檔案大小","option-format": "標題格式","option-itags": "最喜愛的格式","button-options": "選項","button-options-close": "關閉","button-update": "請點選此處更新 YouTube Video Download","error-no-downloads": "沒有可下載的串流"},
 "zh": {"language": "Chinese (Simplified)","credit0-name": "Louiz","credit0-url": "http://userscripts.org/users/349372","download-button-tip": "保存到本地","download-button-text": "下载","menu-button-tip": "选择下载格式","group-options": "选项","group-high-definition": "标准分辨率","group-standard-definition": "较高分辨率","group-mobile": "Mobile","group-unknown": "未知格式","group-update": "已推出新版YouTube下载插件！","option-check": "检查更新","option-format": "标题格式","button-options": "选项","button-options-close": "close","button-update": "更新请点击这里","error-no-downloads": "下载格式不可用"},
};
function T(item) { return Languages.current[item] || Languages.en[item]; }
Languages.current = (yt && yt.config_ && yt.config_.HL_LOCALE && Languages[yt.config_.HL_LOCALE]) || Languages[document.documentElement.getAttribute("lang")] || Languages.en;
// StreamMap - Get and convert format maps
var StreamMap = (function() {
 var self = {
  getStreams: getStreams,
  getURL: getURL,
  sortFunc: sortFunc,
  getExtension: getExtension,
 };
 // Just in case the auto format detection code breaks, fall back on these
 // defaults for determining what is in the streams
 var defaultStreams = [
  { itag: 5 , width: 320, height: 240, container: "FLV" , acodec:"MP3" , vcodec: "H.263" },
  { itag: 17 , width: 176, height: 144, container: "3GPP", acodec:"AAC" , vcodec: "MPEG-4", vprofile: "Simple" },
  { itag: 18 , width: 640, height: 360, container: "MP4" , acodec:"AAC" , vcodec: "H.264" , vprofile: "Baseline", level: 3.0 },
  { itag: 22 , width: 1280, height: 720, container: "MP4" , acodec:"AAC" , vcodec: "H.264" , vprofile: "High" , level: 3.1 },
  { itag: 34 , width: 640, height: 360, container: "FLV" , acodec:"AAC" , vcodec: "H.264" , vprofile: "Main" , level: 3.0 },
  { itag: 35 , width: 854, height: 480, container: "FLV" , acodec:"AAC" , vcodec: "H.264" , vprofile: "Main" , level: 3.0 },
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
 // Map containers to the order they sort in
 function containerToNum(container)
 {
  if (String(localStorage["ytd-prefer-webm"]) == "true")
   return {
    "WebM": 1,
    "MP4": 2,
    "FLV": 3,
    "3GPP": 4,
   }[container] || 5;
  else
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
 // getExtension(stream) - Get the file extension associated with the
 // container type of the specified stream
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
var Styles = (function() {
 var self = {
  injectStyle: injectStyle,
 };
 // injectStyle(text) - Add a stylesheet to the page's head
 function injectStyle(text)
 {
  var style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.textContent = text;
  document.head.appendChild(style);
 }
 return self;
})();
Styles["styles"] = "/* Download buttons */#watch7-sentiment-actions .yt-uix-button {margin-right: 2px;}#watch7-sentiment-actions > .yt-uix-button-group:last-child > button:last-child, #watch7-sentiment-actions > button:last-child {margin-right: 0px;}#watch7-secondary-actions .yt-uix-button {margin-left: 7px;}#watch7-secondary-actions > span:first-child > .yt-uix-button:first-child, #watch7-secondary-actions > .yt-uix-button:first-child {margin-left: 0px;}#watch7-sentiment-actions #ytd-dl-button {margin-right: -1px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;}#watch7-sentiment-actions #ytd-menu-button {border-top-left-radius: 0px;border-bottom-left-radius: 0px;}#watch7-sentiment-actions #ytd-menu-button .yt-uix-button-arrow {margin: 0px;}/* Menu */#ytd-menu {font-size: 12px;box-shadow: 0 3px 3px rgba(0, 0, 0, 0.1);max-height: 100%;overflow-x: hidden;}#ytd-options-button {position: absolute;right: 8px;top: 8px;}.ytd-header {padding: 2px 13px;font-weight: bold;padding-top: 5px;border-bottom: 1px solid #999;}/* Menu items */#ytd-menu .ytd-item-group {position: relative;}#ytd-menu .ytd-item-group:hover {background-color: #777;}#ytd-menu .ytd-item-group:hover .yt-uix-button-menu-item {color: #fff;}#ytd-menu .ytd-item-group .ytd-item-size {position: absolute;left: 0px;top: 0px;width: 55px;padding: 8px 0px;text-align: right;color: inherit;}#ytd-menu .ytd-item-group .ytd-item-main {display: block;padding: 8px 0px 8px 55px;}#ytd-menu .ytd-item-group .ytd-item-sub {display: block;position: absolute;top: 0px;width: 53px;border-left: 1px solid #ddd;padding: 8px 5px;}#ytd-menu .ytd-item-group:hover .ytd-item-sub {border-left: 1px solid #666;}#ytd-menu .ytd-item-update {padding: 8px 20px;}/* uix checkboxes */.ytd-checkbox-container {margin: 6px 6px 6px 13px;}.ytd-checkbox-label {display: block;padding-right: 13px;}.ytd-textbox-container {margin: 6px 13px;}/* uix textboxes */.ytd-textbox-container .yt-uix-form-input-text {display: block;box-sizing: border-box;-moz-box-sizing: border-box;width: 100%;}.ytd-textbox-label {display: block;padding: 3px 6px;}";
Styles["styles-rtl"] = "/* Download buttons */#watch7-sentiment-actions .yt-uix-button {margin-left: 2px;}#watch7-sentiment-actions > .yt-uix-button-group:last-child > button:last-child, #watch7-sentiment-actions > button:last-child {margin-left: 0px;}#watch7-secondary-actions .yt-uix-button {margin-right: 7px;}#watch7-secondary-actions > span:first-child > .yt-uix-button:first-child, #watch7-secondary-actions > .yt-uix-button:first-child {margin-right: 0px;}#watch7-sentiment-actions #ytd-dl-button {margin-left: -1px;border-top-left-radius: 0px;border-bottom-left-radius: 0px;}#watch7-sentiment-actions #ytd-menu-button {border-top-right-radius: 0px;border-bottom-right-radius: 0px;}#watch7-sentiment-actions #ytd-menu-button .yt-uix-button-arrow {margin: 0px;}/* Menu */#ytd-menu {font-size: 12px;box-shadow: 0 3px 3px rgba(0, 0, 0, 0.1);max-height: 100%;overflow-x: hidden;}#ytd-options-button {position: absolute;left: 8px;top: 8px;}.ytd-header {padding: 2px 13px;font-weight: bold;padding-top: 5px;border-bottom: 1px solid #999;}/* Menu items */#ytd-menu .ytd-item-group {position: relative;}#ytd-menu .ytd-item-group:hover {background-color: #777;}#ytd-menu .ytd-item-group:hover .yt-uix-button-menu-item {color: #fff;}#ytd-menu .ytd-item-group .ytd-item-size {position: absolute;right: 0px;top: 0px;width: 55px;padding: 8px 0px;text-align: left;color: inherit;}#ytd-menu .ytd-item-group .ytd-item-main {display: block;padding: 8px 55px 8px 0px;}#ytd-menu .ytd-item-group .ytd-item-sub {display: block;position: absolute;top: 0px;width: 53px;border-right: 1px solid #ddd;padding: 8px 5px;}#ytd-menu .ytd-item-group:hover .ytd-item-sub {border-right: 1px solid #666;}#ytd-menu .ytd-item-update {padding: 8px 20px;}/* uix checkboxes */.ytd-checkbox-container {margin: 6px 6px 6px 13px;}.ytd-checkbox-label {display: block;padding-right: 13px;}.ytd-textbox-container {margin: 6px 13px;}/* uix textboxes */.ytd-textbox-container .yt-uix-form-input-text {display: block;box-sizing: border-box;-moz-box-sizing: border-box;width: 100%;}.ytd-textbox-label {display: block;padding: 3px 6px;}";
// Interface - Handles the user interface for the watch page
var Interface = (function() {
 var self = {
  init: init,
  update: update,
  notifyUpdate: notifyUpdate,
 };
 var rtl = document.body.getAttribute("dir") == "rtl",
     groups,
     lastStreams,
     links = [],
     nextId = 0;
 // createOptionsButton() - Creates the button that opens the options menu
 function createOptionsButton()
 {
  var elem = document.createElement("a"),
   optionsOpen = false;
  elem.setAttribute("id", "ytd-options-button");
  elem.setAttribute("href", "javascript:;");
  elem.innerHTML = T("button-options");
  elem.addEventListener("click", function() {
   optionsOpen = !optionsOpen;
   self.options.style.display = optionsOpen ? "" : "none";
   elem.innerHTML = optionsOpen ? T("button-options-close") : T("button-options");
  });
  return elem
 }
 // createHeader(text) - Creates a menu section header
 function createHeader(text)
 {
  var elem = document.createElement("div");
  elem.className = "ytd-header";
  elem.appendChild(document.createTextNode(text));
  return elem;
 }
 // createCheckbox(text) - Creates a YouTube uix checkbox
 function createCheckbox(labelText, checked, callback)
 {
  var label = document.createElement("label"),
      span = document.createElement("span"),
      checkbox = document.createElement("input"),
      elem = document.createElement("span");
  label.className = "ytd-checkbox-label";
  span.className = "ytd-checkbox-container yt-uix-form-input-checkbox-container" + (checked ? "  checked" : "");
  checkbox.className = "yt-uix-form-input-checkbox";
  checkbox.setAttribute("type", "checkbox");
  checkbox.checked = !!checked;
  checkbox.addEventListener("change", function() {
   callback(checkbox.checked);
  }, true);
  elem.className = "yt-uix-form-input-checkbox-element";
  span.appendChild(checkbox);
  span.appendChild(elem);
  label.appendChild(span);
  label.appendChild(document.createTextNode(labelText));
  return label;
 }
 // createTextbox(text) - Creates a YouTube uix textbox
 function createTextbox(labelText, text, ltr, callback)
 {
  var label = document.createElement("label"),
      container = document.createElement("div"),
      box = document.createElement("input");
  container.className = "ytd-textbox-container";
  box.className = "yt-uix-form-input-text";
  box.value = text;
  if (rtl && ltr)
   box.setAttribute("dir", "ltr");
  box.addEventListener("input", function() {
   callback(box.value);
  });
  label.className = "ytd-textbox-label";
  label.appendChild(document.createTextNode(labelText));
  label.appendChild(document.createElement("br"));
  label.appendChild(container);
  container.appendChild(box);
  return label;
 }
 // createOptions() - Creates the options menu
 function createOptions()
 {
  var elem = document.createElement("div");
  elem.setAttribute("id", "ytd-options");
  elem.appendChild(createHeader(T("group-options")));
  // Determine whether to check GitHub for updates every two days
  elem.appendChild(createCheckbox(T("option-check"), String(localStorage["ytd-check-updates"]) == "true", function (checked) {
   localStorage["ytd-check-updates"] = checked;
  }));
  // Prefer WebM over MP4
  elem.appendChild(createCheckbox(T("option-webm"), String(localStorage["ytd-prefer-webm"]) == "true", function (checked) {
   localStorage["ytd-prefer-webm"] = checked;
   update(lastStreams);
  }));
  // Determine whether to get video file sizes (Chrome only)
  if (window.chrome)
   elem.appendChild(createCheckbox(T("option-sizes"), String(localStorage["ytd-get-sizes"]) == "true", function (checked) {
    localStorage["ytd-get-sizes"] = checked;
   }));
  // Title format
  elem.appendChild(createTextbox(T("option-format"), localStorage["ytd-title-format"], true, function (text) {
   localStorage["ytd-title-format"] = text;
   updateLinks();
  }));
  // Favourite itags
  elem.appendChild(createTextbox(T("option-itags"), localStorage["ytd-itags"], false, function (text) {
   localStorage["ytd-itags"] = text.split(",").map(Number).filter(identity).map(Math.floor).join(", ");
   update(lastStreams);
  }));
  elem.style.display = "none";
  return elem;
 }
 // createDlButton() - Creates the instant download button
 function createDlButton()
 {
  var link = document.createElement("a"),
      elem = document.createElement("button");
  link.setAttribute("href", "javascript:;");
  elem.className = "start yt-uix-button yt-uix-button-text yt-uix-tooltip";
  elem.setAttribute("id", "ytd-dl-button");
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
  elem.className = "end yt-uix-button yt-uix-button-text yt-uix-button-empty yt-uix-tooltip";
  elem.setAttribute("id", "ytd-menu-button");
  elem.setAttribute("title", T("menu-button-tip"));
  elem.setAttribute("type", "button");
  elem.setAttribute("role", "button");
  elem.setAttribute("onclick", "; return false;");
  elem.innerHTML = "<img class=\"yt-uix-button-arrow\" src=\"//s.ytimg.com/yt/img/pixel-vfl73.gif\" alt=\"\">";
  return elem;
 }
 // createMenu() - Creates the downloads menu
 function createMenu()
 {
  var elem = document.createElement("div");
  elem.className = "yt-uix-button-menu";
  elem.setAttribute("id", "ytd-menu");
  elem.style.display = "none";
  return elem;
 }
 // formatTitle(stream) - Format stream information for the tooltips
 function formatTitle(stream)
 {
  return T("format-tip") + stream.itag + ", " + (stream.vcodec ? stream.vcodec + "/" + stream.acodec : "") +
   (stream.vprofile ? " (" + stream.vprofile + (stream.level ? "@L" + stream.level.toFixed(1) : "") + ")" : "");
 }
 // updateLink(href, target) - Informs the privileged extension code that a
 // new link has been added
 function updateLink(href, target)
 {
  if (!window.chrome || String(localStorage["ytd-get-sizes"]) != "true")
   return;
  var data = { "href": href, target: target };
  var event = document.createEvent("MessageEvent");
  event.initMessageEvent("ytd-update-link", true, true, JSON.stringify(data), document.location.origin, "", window);
  document.dispatchEvent(event);
 }
 // createMenuItemGroup() - Creates a sub-group for a set of related streams
 function createMenuItemGroup(streams)
 {
  // Create the button group and the size label ("360p", "480p", etc.)
  var itemGroup = document.createElement("div"),
      size = document.createElement("div"),
      mainLink = document.createElement("a"),
      mainId = nextId ++;
  itemGroup.className = "ytd-item-group";
  itemGroup.style.minWidth = streams.length * 64 + 48 + "px";
  size.className = "ytd-item-size yt-uix-button-menu-item";
  // Create the main video link
  mainLink.className = "ytd-item ytd-item-main yt-uix-button-menu-item";
  mainLink.setAttribute("id", "ytd-" + mainId);
  mainLink.setAttribute("title", formatTitle(streams[0]));
  links.push({ stream: streams[0], anchor: mainLink });
  updateLink(StreamMap.getURL(streams[0]), "ytd-" + mainId);
  if (rtl)
   mainLink.style.marginLeft = (streams.length - 1) * 64 + "px";
  else
   mainLink.style.marginRight = (streams.length - 1) * 64 + "px";
  mainLink.addEventListener("contextmenu", function(e) {
   // Prevent right-click closing the menu in Chrome
   e.stopPropagation();
  }, false);
  // Append the main link to the button group
  size.appendChild(document.createTextNode(streams[0].height + "p\u00a0"));
  mainLink.appendChild(size);
  mainLink.appendChild(document.createTextNode((streams[0].stereo3d ? "3D " : "") + streams[0].container));
  itemGroup.appendChild(mainLink);
  // Create each sublink
  for (var i = 1, max = streams.length; i < max; i ++)
  {
   var subLink = document.createElement("a"),
       subId = nextId ++;
   subLink.className = "ytd-item-sub yt-uix-button-menu-item";
   subLink.setAttribute("id", "ytd-" + subId);
   subLink.setAttribute("title", formatTitle(streams[i]));
   if (streams[i].audio)
    Audio.updateLink(streams[i], subLink);
   else
   {
    links.push({ stream: streams[i], anchor: subLink });
    updateLink(StreamMap.getURL(streams[i]), "ytd-" + subId);
   }
   if (rtl)
    subLink.style.left = (streams.length - i - 1) * 64 + "px";
   else
    subLink.style.right = (streams.length - i - 1) * 64 + "px";
   subLink.addEventListener("contextmenu", function(e) {
    // Prevent right-click closing the menu in Chrome
    e.stopPropagation();
   }, false);
   // Append the sublink to the button group
   subLink.appendChild(document.createTextNode(
    (streams[i].audio ? streams[i].acodec : (streams[i].stereo3d ? "3D " : "") + streams[i].container)
   ));
   itemGroup.appendChild(subLink);
  }
  return itemGroup;
 }
 // createGroup(title, streams) - Creates a new menu group
 function createGroup(title, flat, streams)
 {
  var elem = document.createElement("div");
  elem.appendChild(createHeader(title));
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
 // createUpdate() - Creates the updates button
 function createUpdate()
 {
  var elem = document.createElement("div");
  elem.appendChild(createHeader(T("group-update")));
  var a = document.createElement("a");
  a.className = "ytd-item-update yt-uix-button-menu-item";
  a.setAttribute("href", "https://userscripts.org/scripts/source/62634.user.js");
  a.appendChild(document.createTextNode(T("button-update")));
  elem.appendChild(a);
  return elem;
 }
 // setDlButton(stream) - Sets the default stream to download
 function setDlButton(stream)
 {
  self.dlButton.getElementsByTagName("button")[0]
   .setAttribute("title", T("download-button-tip") +
   " (" + stream.height + "p " + stream.container + ")");
  links.push({ stream: stream, anchor: self.dlButton });
 }
 // updateLinks() - Set the href and download attributes of all video
 // download links
 function updateLinks()
 {
  for (var i = 0, max = links.length; i < max; i ++)
  {
   var title = formatFileName(format(localStorage["ytd-title-format"], merge(links[i].stream, VideoInfo)));
   links[i].anchor.setAttribute("download", title + StreamMap.getExtension(links[i].stream));
   links[i].anchor.setAttribute("href", StreamMap.getURL(links[i].stream, title));
  }
 }
 // update(streams) - Adds streams to the menu
 function update(streams)
 {
  lastStreams = streams;
  streams = streams
   .filter(function(obj) { return obj.url; })
   .sort(StreamMap.sortFunc);
  links = [];
  var favouriteItags = localStorage["ytd-itags"].split(",").map(Number);
  var favouriteStreams =
   streams
    .filter(function(obj) {
     return (obj.favouriteIndex = favouriteItags.indexOf(Number(obj.itag))) + 1;
    })
    .sort(function(a, b) { return a.favouriteIndex - b.favouriteIndex; });
  if (favouriteStreams.length)
   setDlButton(favouriteStreams[0]);
  else if (streams.length)
   setDlButton(streams[0]);
  else
  {
   var button = self.dlButton.getElementsByTagName("button")[0];
   self.menuButton.disabled = true;
   self.menuButton.setAttribute("title", "");
   button.setAttribute("title", T("error-no-downloads"));
  }
  self.downloads.innerHTML = "";
  for (var i = 0, max = groups.length; i < max; i ++)
  {
   var groupStreams = streams.filter(groups[i].predicate);
   if (groupStreams.length)
    self.downloads.appendChild(createGroup(groups[i].title, groups[i].flat, groupStreams));
  }
  updateLinks();
 }
 // init() - Initalises the user interface
 function init()
 {
  // Get the flag button from the actions menu
  var buttonGroup = document.createElement("span"),
      watchSentimentActions = document.getElementById("watch7-sentiment-actions"),
      watchLike = document.getElementById("watch-like"),
      watchDislike = document.getElementById("watch-dislike");
  // Inject stylesheet(s)
  if (rtl)
   Styles.injectStyle(Styles["styles-rtl"]);
  else
   Styles.injectStyle(Styles["styles"]);
  groups = [
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
  buttonGroup.className = "yt-uix-button-group";
  // Create the buttons
  self.dlButton = createDlButton();
  self.menuButton = createMenuButton();
  // Create the dropdown menu
  self.menu = createMenu();
  self.menu.appendChild(createOptionsButton());
  self.menu.appendChild(self.options = createOptions());
  self.menu.appendChild(self.downloads = document.createElement("div"));
  self.menuButton.appendChild(self.menu);
  // Populate the button group
  buttonGroup.appendChild(self.dlButton);
  buttonGroup.appendChild(self.menuButton);
  if (watchLike)
  {
   // If the like button is disabled, all the controls should be
   // disabled
   self.dlButton.disabled = self.menuButton.disabled = watchLike.disabled;
   // Add a space between the Like and Dislike buttons to make them
   // consistent with the download button in Chrome
   watchDislike.parentNode.insertBefore(document.createTextNode(" "), watchDislike);
  }
  watchSentimentActions.appendChild(buttonGroup);
 }
 // notifyUpdate() - Notify the user of an available update
 function notifyUpdate()
 {
  self.menu.appendChild(createUpdate());
 }
 return self;
})();
// Update - Check Userscripts.org for updates
var Update = (function() {
 var self = {
  check: check,
 };
 // check() - Query Userscripts.org for changes to the script's version
 // number. If there is, inform the Interface module.
 function check()
 {
  delete localStorage["ytd-update-version"];
  delete localStorage["ytd-last-update"];
  window.addEventListener("message", function(event) {
   if (!event.data)
    return;
   var remoteVersion = /^\/\/ @version\s+(.+)$/m.exec(event.data)[1];
   if (remoteVersion)
   {
    localStorage["ytd-last-update"] = Date.now();
    localStorage["ytd-update-version"] = remoteVersion;
    if (remoteVersion != version)
     Interface.notifyUpdate();
   }
  }, false);
  var iframe = document.createElement("iframe");
  iframe.setAttribute("src", "https://userscripts.org/scripts/source/62634.meta.js");
  iframe.setAttribute("style", "position: absolute; left: -1px; top: -1px; width: 1px; height: 1px; opacity: 0;");
  document.body.appendChild(iframe);
 }
 return self;
})();
function main()
{
 if (localStorage.getItem("ytd-check-updates") === null)
  localStorage["ytd-check-updates"] = true;
 if (localStorage.getItem("ytd-prefer-webm") === null)
  localStorage["ytd-prefer-webm"] = false;
 if (localStorage.getItem("ytd-get-sizes") === null)
  localStorage["ytd-get-sizes"] = false;
 if (localStorage.getItem("ytd-title-format") === null)
  localStorage["ytd-title-format"] = "${title}";
 if (localStorage.getItem("ytd-itags") === null)
  localStorage["ytd-itags"] = "37, 22, 18";
 VideoInfo.init();
 Interface.init();
 Interface.update(StreamMap.getStreams());
 if ((String(localStorage["ytd-check-updates"]) == "true"))
  if (localStorage["ytd-current-version"] != version ||
   !localStorage["ytd-last-update"] ||
   Number(localStorage["ytd-last-update"]) < Date.now() - 2 * 24 * 60 * 60 * 1000)
   Update.check();
  else if (localStorage["ytd-update-version"] && localStorage["ytd-update-version"] != version)
   Interface.notifyUpdate();
 localStorage["ytd-current-version"] = version;
}
  main();
 }
 inject(script);
})();
