/**
 * Copyright 2016 Fin2B Inc. (http://fin2b.com/)
 * All Right Reserved.
 *
 * NOTICE : All information contained herein is, and remains
 * the property of Fin2B Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Fin2B Incorporated
 * and its suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Fin2B Incorporated.
 *
 * @ CreatedAt 2016. 10. 27.
 * @ Author(s):
 *     Daehee Han
 **/

/*
HTML, CSS 파일을 읽어서 inlined CSS 형태의 HTML 파일을 생성한다.

public/mail/*.inlined.html 파일은  *.html을 자동 변환한 것임.
inline CSS 형태로 만들어 주기 위해 아래 작업을 해야 함.
helpers/ 폴더 에서 아래와 같이 명령어 실행해야 함.
$ node buildInlineEmailHtml.js
*/

var fs = require('fs');
var path = require('path');
var inlineCss = require('inline-css');


/*
inline 처리되지 않을 원본 html 파일들의 목록을 리턴한다
*/
function getListOfHtmlFiles(folder) {
  var results = [];
  var list = fs.readdirSync(folder);
  list.forEach(function(file) {
    file = path.join(folder, file);
    //console.log(file);
    if (file.endsWith('.html') && file.indexOf('.inlined')===-1) {
      results.push(file);
    }

    var stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    }

  });
  return results;
}

/*
htmlFile을 읽어서  inlinedHtml 파일을 생성함.
이런 변환작업에 CSS파일내용과 서버 URL 이 필요함.
*/
function buildInlinedHtml(htmlFile, inlinedFile, cssContent, fin2bUrl) {
  var html = fs.readFileSync(htmlFile, 'utf-8');
  var options = {
    extraCss: cssContent,
    url: fin2bUrl
  };
  inlineCss(html, options).then(function(inlinedHtml) {
    console.log('HTML', htmlFile, html.length, 'INLINED HTML', inlinedFile, inlinedHtml.length);
    fs.writeFileSync(inlinedFile, inlinedHtml, 'utf-8');
  });
}

/*
파일명 변환: abc.html --> abc.inlined.html
*/
function insertExtension(fname, extension) {
  var flds = fname.split('.');
  flds.splice(-1, 0, extension);
  return flds.join('.');
}

/*
주어진 폴더내의 모든 html파일에 대해 변환 작업을 수행함.
*/
function main(htmlFolder, cssFile, fin2bUrl) {
  var htmlFiles = getListOfHtmlFiles('../public/mail');
  var cssContent = fs.readFileSync(CSSFILE, 'utf-8');

  htmlFiles.forEach(function(htmlFile) {
    var inlinedFile = insertExtension(htmlFile, 'inlined');
    buildInlinedHtml(htmlFile, inlinedFile, cssContent, fin2bUrl);
  });
}


// main
var FIN2B_URL = "http://demo1.fin2b.com/mail/";
var CSSFILE = '../public/mail/style-mail.css';
main('../public/mail', CSSFILE, FIN2B_URL);
