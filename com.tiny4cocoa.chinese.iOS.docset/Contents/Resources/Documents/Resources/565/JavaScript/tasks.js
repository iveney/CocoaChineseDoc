/* Copyright © 2011 Apple Inc.  All rights reserved. */
Element.prototype.getHeightWithMargins=function(){var c=this.getStyles(),a=parseInt(c.height,10),d=parseInt(c.marginTop,10),e=parseInt(c.marginBottom,10),b=this.clientHeight/a;return this.clientHeight+parseInt(b*d,10)+parseInt(b*e,10)};var Tasks={transitionLength:250,hasEventListeners:false,supportsTouches:("createTouch" in document),isIpad:typeof iPad_DeveloperLibrary=="object",isDesktop:typeof DevPubs=="object",init:function(a){a=a||{};this.tasks=$$(".task");this.inlineRecipes=$$(".inlinerecipe");this.buildTasks(a.tasksClosed);this.loadRecipes(a.pageDir);if(!this.hasEventListeners){Event.observe(window,"resize",this.handleResize.bindAsEventListener(this));Event.observe(window,"click",this.handleClick.bindAsEventListener(this));this.hasEventListeners=true;setTimeout(function(){this.tasks.forEach(function(b){this.attachTransition(b)}.bind(this))}.bind(this),100)}return this},updateRecipeContent:function(a,b){a.select("img").forEach(function(c){c.src=b+c.getAttribute("src")});if(this.isDesktop){DevPubs.initMovies($$(".moviePanel"),b)}if(this.isIpad){iPad_DeveloperLibrary.contents.documentViewController.enableVideos($$(".moviePanel"),b)}},loadRecipes:function(a){this.inlineRecipes.forEach(function(g){var d=g.down("a"),b=g.down(".task-content");if(!d){return}var c=d.getAttribute("href");d.removeAttribute("href");if(a){c=a+c}b.setAttribute("data-source-url",c.directoryForURL());var e=c.directoryForURL();var f=new Ajax.Request(c,{onSuccess:function(h){b.innerHTML=h.responseText;this.updateRecipeContent(b,e);Tasks.init()}.bind(this)})}.bind(this))},buildTasks:function(a){this.tasks.forEach(function(d){var c=d.down(".task-name"),e=d.down(".task-content"),b=0;this.makeClickableOnIpad(c);if(a||d.hasClassName("closed")){b=c.getHeightWithMargins();d.addClassName("closed")}else{b=c.getHeightWithMargins()+e.getHeightWithMargins()}d.style.height=b+"px"}.bind(this))},makeClickableOnIpad:function(a){if(this.supportsTouches){Event.observe(a,"touchend",this.handleClick.bindAsEventListener(this))}},openTask:function(d){if(!d){return}var a=d.down(".task-name"),e=d.down(".task-content"),c=a.getHeightWithMargins(),b=e.getHeightWithMargins();d.style.height=c+b+"px";d.removeClassName("closed");this.isOpening=true;setTimeout(function(){this.isOpening=false;if(this.isIpad){iPad_DeveloperLibrary.contents.documentViewController.contentView.refreshSize()}}.bind(this),this.transitionLength)},closeTask:function(c){if(!c||this.isOpening){return}var a=c.down(".task-name"),b=a.getHeightWithMargins();c.style.height=b+"px";setTimeout(function(){c.addClassName("closed");if(this.isIpad){iPad_DeveloperLibrary.contents.documentViewController.contentView.refreshSize()}},this.transitionLength)},attachTransition:function(b){var a=this.transitionLength/1000;if(b.style["-webkit-transition"]!=="height "+a+"s ease-in-out"){b.style["-webkit-transition"]="height "+a+"s ease-in-out"}},isNotATaskElement:function(b){var a=["body","section","article"];return(!b.attributes||(!b.hasClassName("task")&&a.indexOf(b.tagName.toLowerCase())<0))},getTaskElement:function(a){if(!a){return null}var b=a;while(b&&this.isNotATaskElement(b)){b=b.parentNode}return(b&&b.hasClassName("task"))?b:null},isLinkInRecipe:function(a){if(!a){return false}if((a.tagName.toLowerCase()=="a")&&a.up(".inlinerecipe-content")){return true}return false},updateRecipeLinkHREF:function(c){var a=c.up(".inlinerecipe-content").getAttribute("data-source-url"),b=c.getAttribute("href");if(b.substr(0,2)=="<@"||b.isHTTPurl()){return}c.href=a+b},handleClick:function(a){var b=a.element(),c=this.getTaskElement(b);if(this.isLinkInRecipe(b)){this.updateRecipeLinkHREF(b)}if(!c||!b){return}if(b.hasClassName("task-name")||b.up(".task-name")){if(c.hasClassName("closed")){this.openTask(c)}else{this.closeTask(c)}}},handleResize:function(a){if(!this.isResizing){this.isResizing=true}else{clearTimeout(this.resizeTimer)}this.resizeTimer=setTimeout(function(){this.isResizing=false;this.buildTasks()}.bind(this),50)}};var FindObserver={selection:null,interval:null,init:function(){var a=this;this.interval=setInterval(function(){a.checkSelection()},50)},selectionDidChange:function(){if(!this.selection){return}var a=Tasks.getTaskElement(this.selection);if(a&&a.hasClassName("closed")){Tasks.openTask(a)}},checkSelection:function(){var a=document.getSelection().baseNode;if(this.selection!==a){this.selection=a;this.selectionDidChange()}}};Event.observe(window,"dom:loaded",function(a){if(typeof iPad_DeveloperLibrary=="undefined"){Tasks.init({tasksClosed:true});FindObserver.init()}});