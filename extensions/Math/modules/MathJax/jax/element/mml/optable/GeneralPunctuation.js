jsWC=window.jsWC || {}; jsWC["./extensions/Math/modules/MathJax/jax/element/mml/optable/GeneralPunctuation.js"]=1379;

/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/optable/GeneralPunctuation.js
 *
 *  Copyright (c) 2010 Design Science, Inc.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

(function (MML) {
  var MO = MML.mo.OPTYPES;
  var TEXCLASS = MML.TEXCLASS;

  MathJax.Hub.Insert(MML.mo.prototype,{
    OPTABLE: {
      prefix: {
        '\u2018': [0,0,TEXCLASS.OPEN,{fence: true}], // left single quotation mark
        '\u201C': [0,0,TEXCLASS.OPEN,{fence: true}]  // left double quotation mark
      },
      postfix: {
        '\u2019': [0,0,TEXCLASS.CLOSE,{fence: true}], // right single quotation mark
        '\u201D': [0,0,TEXCLASS.CLOSE,{fence: true}]  // right double quotation mark
      }
    }
  });

  MathJax.Ajax.loadComplete(MML.optableDir+"/GeneralPunctuation.js");

})(MathJax.ElementJax.mml);
