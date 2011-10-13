//** Simple Controls Gallery- (c) Dynamic Drive DHTML code library: http://www.dynamicdrive.com
//** Dec 7th, 08'- Script created (Requires jquery 1.2.x)
//** February 6th, 09'- Updated to v 1.3:
	//1) Adds Description Panel to optionally show a textual description for each slide
	//2) In Auto Play mode, you can now set the number of cycles before gallery stops.
	//3) Inside oninit() and onslide(), keyword "this" now references the current gallery instance


var simpleGallery_navpanel={
	panel: {height:'35px', opacity:1.0, paddingTop:'5px', fontStyle:'bold 11px Verdana'}, //customize nav panel container
	images: [ 'images/photoalbum/left.gif', 'images/photoalbum/play.gif', 'images/photoalbum/right.gif', 'images/photoalbum/pause.gif'], //nav panel images (in that order)
	imageSpacing: {offsetTop:[-3, 0, -3], spacing:1}, //top offset of left, play, and right images, PLUS spacing between the 3 images
	slideduration: 500 //duration of slide up animation to reveal panel
}

function simpleGallery(settingarg){
	this.setting=settingarg 
	settingarg=null
	var setting=this.setting
	setting.panelheight=(parseInt(setting.navpanelheight)>5)? parseInt(setting.navpanelheight) : parseInt(simpleGallery_navpanel.panel.height)
	setting.fadeduration=parseInt(setting.fadeduration)
	setting.curimage=(setting.persist)? simpleGallery.routines.getCookie("gallery-"+setting.wrapperid) : 0
	setting.curimage=setting.curimage || 0 //account for curimage being null if cookie is empty
	setting.ispaused=!setting.autoplay[0] //ispaused reflects current state of gallery, autoplay[0] indicates whether gallery is set to auto play
	setting.currentstep=0 //keep track of # of slides slideshow has gone through
	setting.totalsteps=setting.imagearray.length*setting.autoplay[2] //Total steps limit: # of images x # of user specified cycles
	setting.fglayer=0, setting.bglayer=1 //index of active and background layer (switches after each change of slide)
	setting.oninit=setting.oninit || function(){}
	setting.onslide=setting.onslide || function(){}
	var preloadimages=[], longestdesc=null, longestcaption=null //preload images
	setting.longestdesc="" //get longest description of all slides. If no desciptions defined, variable contains ""
	setting.longestcaption=""
	for (var i=0; i<setting.imagearray.length; i++){
		preloadimages[i]=new Image()
		preloadimages[i].src=setting.imagearray[i][0]
		if (setting.imagearray[i][3] && setting.imagearray[i][3].length>setting.longestdesc.length){
			setting.longestdesc=setting.imagearray[i][3]
		}
		if (setting.imagearray[i][6] && setting.imagearray[i][6].length>setting.longestcaption.length){
			setting.longestcaption=setting.imagearray[i][6]
		}
	}
}

simpleGallery.prototype={

	start:function(){
		var slideshow=this
		var setting=slideshow.setting
		
		var slideHeight = simpleGallery.routines.determineSlideHeight(setting.longestcaption, setting.dimensions[1], setting.dimensions[2]);
		
		setting.$wrapperdiv=$('#'+setting.wrapperid).css({position:'relative', visibility:'visible', background:setting.bgcolor, overflow:'hidden', width:setting.dimensions[0], height:slideHeight}).empty() //main gallery DIV
		
		if (setting.$wrapperdiv.length==0){ //if no wrapper DIV found
			alert("Error: DIV with ID \""+setting.wrapperid+"\" not found on page.")
			return
		}
		setting.$gallerylayers=$('<div class="gallerylayer" style="width: 100%"></div><div class="gallerylayer" style="width: 100%"></div>') //two stacked DIVs to display the actual slide 
			.css({position:'absolute', left:0, top:0})
			.appendTo(setting.$wrapperdiv)
		setting.gallerylayers=setting.$gallerylayers.get() //cache stacked DIVs as DOM objects
		setting.navbuttons=simpleGallery.routines.addnavpanel(setting) //get 4 nav buttons DIVs as DOM objects
		if (setting.longestdesc!="") //if at least one slide contains a description (feature is enabled)
			setting.descdiv=simpleGallery.routines.adddescpanel(setting)
			
	    if (setting.longestcaption!="") //if at least one slide contains a caption (feature is enabled)
			setting.captiondiv=simpleGallery.routines.addcaptionpanel(setting)
			
		$(setting.navbuttons).filter('img.navimages').css({opacity:1})
			.bind('mouseover mouseout', function(e){
				$(this).css({opacity:(e.type=="mouseover")? 1 : 1})
			})
			.bind('click', function(e){
				var keyword=e.target.title.toLowerCase()
				slideshow.navigate(keyword) //assign behavior to nav images
			})
		$(setting.navbuttons).filter('img.add-control').css({opacity:1})
			.bind('click', function(e){
				setting.autoplay[1] = (Math.floor(setting.autoplay[1])+ 1000) >10000 ? 10000: Math.floor(setting.autoplay[1])+ 1000
				$(setting.navbuttons).filter('div.delay').html(Math.floor(setting.autoplay[1]/1000) +' sec')
			})
		$(setting.navbuttons).filter('img.minus-control').css({opacity:0.8})
			.bind('click', function(e){
			// slideshow delay cannot be less that 3000ms 
			setting.autoplay[1] = (Math.floor(setting.autoplay[1]) -1000) < 3000 ? 3000: Math.floor(setting.autoplay[1]) -1000
			$(setting.navbuttons).filter('div.delay').html(Math.floor(setting.autoplay[1]/1000) +' sec')
			
			})
		
		$(setting.navbuttons).filter('div.delay').html(Math.floor(setting.autoplay[1]/1000) +' sec')		
		//When user chooses to show browsing control all the time		
		if (setting.showControls){	
			setting.$wrapperdiv.bind('mouseenter mouseleave', function(){slideshow.showhidenavpanel('show')})
			slideshow.showhidenavpanel('show');
		}else{
			setting.$wrapperdiv.bind('mouseenter', function(){slideshow.showhidenavpanel('show')})
			setting.$wrapperdiv.bind('mouseleave', function(){slideshow.showhidenavpanel('hide')})
		}
		
		slideshow.showslide(setting.curimage) //show initial slide
				
		setting.oninit.call(slideshow) //trigger oninit() event
		$(window).bind('unload', function(){ //clean up and persist
			$(slideshow.setting.navbuttons).unbind()
			if (slideshow.setting.persist) //remember last shown image's index
				simpleGallery.routines.setCookie("gallery-"+setting.wrapperid, setting.curimage)
			jQuery.each(slideshow.setting, function(k){
				if (slideshow.setting[k] instanceof Array){
					for (var i=0; i<slideshow.setting[k].length; i++){
						if (slideshow.setting[k][i].tagName=="DIV") //catches 2 gallerylayer divs, gallerystatus div
							slideshow.setting[k][i].innerHTML=null
						slideshow.setting[k][i]=null
					}
				}
				if (slideshow.setting[k].innerHTML) //catch gallerydesctext div
					slideshow.setting[k].innerHTML=null
				slideshow.setting[k]=null
			})
			slideshow=slideshow.setting=null
		})
	},

	navigate:function(keyword){
		clearTimeout(this.setting.playtimer)
		this.setting.totalsteps=100000 //if any of the nav buttons are clicked on, set totalsteps limit to an "unreachable" number 
		if (!isNaN(parseInt(keyword))){
			this.showslide(parseInt(keyword))
		}
		else if (/(prev)|(next)/i.test(keyword)){
			this.showslide(keyword.toLowerCase())
		}
		else{ //if play|pause button
			var slideshow=this
			var $playbutton=$(this.setting.navbuttons).eq(1)
			if (!this.setting.ispaused){ //if pause Gallery
				this.setting.autoplay[0]=false
				$playbutton.attr({title:'Play', src:this.setting.relpath + simpleGallery_navpanel.images[1]})
			}
			else if (this.setting.ispaused){ //if play Gallery
				this.setting.autoplay[0]=true
				this.setting.playtimer=setTimeout(function(){slideshow.showslide('next')}, this.setting.autoplay[1])
				$playbutton.attr({title:'Pause', src:this.setting.relpath + simpleGallery_navpanel.images[3]})
			}
			slideshow.setting.ispaused=!slideshow.setting.ispaused
		}
	},

	showslide:function(keyword){
		var slideshow=this
		var setting=slideshow.setting
		var totalimages=setting.imagearray.length
		var imgindex=(keyword=="next")? (setting.curimage<totalimages-1? setting.curimage+1 : 0)
			: (keyword=="prev")? (setting.curimage>0? setting.curimage-1 : totalimages-1)
			: Math.min(keyword, totalimages-1)
		setting.gallerylayers[setting.bglayer].innerHTML=simpleGallery.routines.getSlideHTML(setting.imagearray[imgindex])
		setting.$gallerylayers.eq(setting.bglayer).css({zIndex:1000, opacity:0}) //background layer becomes foreground
			.stop().css({opacity:0}).animate({opacity:1}, setting.fadeduration, function(){ //Callback function after fade animation is complete:
				clearTimeout(setting.playtimer)
				setting.gallerylayers[setting.bglayer].innerHTML=''//null -ktg 040309  //empty bglayer (previously fglayer before setting.fglayer=setting.bglayer was set below)
				try{
					setting.onslide.call(slideshow, setting.gallerylayers[setting.fglayer], setting.curimage)
				}catch(e){
					alert("Simple Controls Gallery: An error has occured somwhere in your code attached to the \"onslide\" event: "+e)
				}
				setting.currentstep+=1
				if (setting.autoplay[0]){
					if (setting.currentstep<=setting.totalsteps)
						setting.playtimer=setTimeout(function(){slideshow.showslide('next')}, setting.autoplay[1])
					else
						slideshow.navigate("play/pause")
				}
			}) //end callback function
		setting.gallerylayers[setting.fglayer].style.zIndex=999 //foreground layer becomes background
		setting.fglayer=setting.bglayer
		setting.bglayer=(setting.bglayer==0)? 1 : 0
		setting.curimage=imgindex
		setting.navbuttons[3].innerHTML=(setting.curimage+1) + '/' + setting.imagearray.length
		if (setting.imagearray[imgindex][3]){ //if this slide contains a description
			setting.$descpanel.css({visibility:'visible'})
			setting.descdiv.innerHTML=setting.imagearray[imgindex][3]
		}
		else if (setting.longestdesc!=""){ //if at least one slide contains a description (feature is enabled)
			setting.descdiv.innerHTML=''//null -ktg 040309
			setting.$descpanel.css({visibility:'hidden'})

		}
		
		if (setting.imagearray[imgindex][6]){ //if this slide contains a caption
			setting.$captionpanel.css({visibility:'visible'})
			setting.captiondiv.innerHTML=setting.imagearray[imgindex][6]
		}
		else if (setting.longestcaption!=""){ //if at least one slide contains a caption (feature is enabled)
			setting.captiondiv.innerHTML=''//null -ktg 040309
			setting.$captionpanel.css({visibility:'hidden'})

		}
	},

	showhidenavpanel:function(state){
		var setting=this.setting
		
		var slideHeight = simpleGallery.routines.determineSlideHeight(setting.longestcaption, setting.dimensions[1], setting.dimensions[2]);
				
		var endpoint=(state=="show")? slideHeight - setting.panelheight : slideHeight
		setting.$navpanel.stop().animate({top:endpoint}, simpleGallery_navpanel.slideduration)
		if (setting.longestdesc!=""){ //if at least one slide contains a description (feature is enabled)
			this.showhidedescpanel(state)
		}
		if (setting.longestcaption!=""){ //if at least one slide contains a caption (feature is enabled)
			this.showhidecaptionpanel(state)
		}
	},

	showhidedescpanel:function(state){
		var setting=this.setting
		var endpoint=(state=="show")? 0 : -setting.descpanelheight
		setting.$descpanel.stop().animate({top:endpoint}, simpleGallery_navpanel.slideduration)
	},
	
	showhidecaptionpanel:function(state){
	    if(state == "show"){
		   var setting=this.setting;
           if(!setting.captionpanel_initialized){
		      var endpoint=(state=="show")? -setting.captionpanelheight : -setting.captionpanelheight;
		      setting.$captionpanel.stop().animate({top:endpoint}, simpleGallery_navpanel.slideduration);
              setting.captionpanel_initialized = "true";
           }
           setting.$captionpanel.css({visibility:'visible'});
        }     
	}
}

simpleGallery.routines={

	getSlideHTML:function(imgelement){
		var layerHTML=(imgelement[1])? '<a href="'+imgelement[1]+'" target="'+imgelement[2]+'">\n' : '' //hyperlink slide?
		//-ktg 040309 added sizing attributes to the dimension to fit to [4], and the offset from the top [5] - valign
		layerHTML+='<img src="'+imgelement[0] + '"' + imgelement[4] + ' style="border-width:0;' + imgelement[5] + '" />'				
		layerHTML+=(imgelement[1])? '</a>' : ''
		return layerHTML //return HTML for this layer
	},

	addnavpanel:function(setting){
	    var slideHeight = this.determineSlideHeight(setting.longestcaption, setting.dimensions[1], setting.dimensions[2]);
	
		var interfaceHTML=''
		for (var i=0; i<3; i++){
			var imgstyle='position:relative; border:0; cursor:hand; cursor:pointer; top:'+simpleGallery_navpanel.imageSpacing.offsetTop[i]+'px; margin-right:'+(i!=2? simpleGallery_navpanel.imageSpacing.spacing+'px' : 0)
			var title=(i==0? 'Prev' : (i==1)? (setting.ispaused? 'Play' : 'Pause') : 'Next')
			var imagesrc=(i==1)? simpleGallery_navpanel.images[(setting.ispaused)? 1 : 3] : simpleGallery_navpanel.images[i]
			interfaceHTML+='<img class="navimages" title="' + title + '" src="' + setting.relpath + imagesrc +'" style="'+imgstyle+'" /> '
		}
		interfaceHTML+='<img class="add-control" title="add" style="border: 0pt none ; position: absolute; right: 0px; cursor: pointer; margin-top: 5px; margin-right: 1px;" src="' + setting.relpath + 'images/photoalbum/plus.gif"/>'
		interfaceHTML+='<div class="delay" style= "position: absolute; top: 0px; margin-top: 9px; margin-right: 4px; right: 11px;" ></div>'
		interfaceHTML+='<img class="minus-control" title="minus" style="border: 0pt none ; position: absolute; cursor: pointer; margin-top: 5px; margin-right: 3px; right: 55px;" src="' + setting.relpath + 'images/photoalbum/minus.gif"/>'
		interfaceHTML+='<div class="gallerystatus" style="position: absolute; top: 0px; left: 0px; margin-top: 10px; margin-left: 4px; float: left;">' + (setting.curimage+1) + '/' + setting.imagearray.length + '</div>'
		
		setting.$navpanel=$('<div class="navpanellayer"></div>')
			.css({position:'absolute', width:'100%', height:setting.panelheight, left:0, top:slideHeight, font:simpleGallery_navpanel.panel.fontStyle, zIndex:'1001'})
			.appendTo(setting.$wrapperdiv)
		$('<div class="navpanelbg"></div><div class="navpanelfg"></div>') //create inner nav panel DIVs
			.css({position:'absolute', left:0, top:0, width:'100%', height:'100%'})
			.eq(0).css({background:'#B5B2B5', opacity:simpleGallery_navpanel.panel.opacity}).end() //"navpanelbg" div
			.eq(1).css({paddingTop:simpleGallery_navpanel.panel.paddingTop, textAlign:'center', color:'white'}).html(interfaceHTML).end() //"navpanelfg" div
			.appendTo(setting.$navpanel)
		return setting.$navpanel.find('img.navimages, div.gallerystatus,img.minus-control,img.add-control,div.delay').get() //return 4 nav related images and DIVs as DOM objects
	},
 
	adddescpanel:function(setting){
	    var slideHeight = this.determineSlideHeight(setting.longestcaption, setting.dimensions[1], setting.dimensions[2]);
	
		setting.$descpanel=$('<div class="gallerydesc"><div class="gallerydescbg"></div><div class="gallerydescfg"><div class="gallerydesctext"></div></div></div>')
			.css({position:'absolute', width:'100%', left:0, top:-1000, zIndex:'1001'})
			.find('div').css({position:'absolute', left:0, top:0, width:'100%'})
			.eq(0).css({background:'#B5B2B5', opacity:simpleGallery_navpanel.panel.opacity}).end() //"gallerydescbg" div
			.eq(1).css({color:setting.fontcolor, fontFamily:setting.fontfamily, fontWeight:'bold', fontSize:Math.floor(slideHeight/25)}).end() //"gallerydescfg" div
			.eq(2).html(setting.longestdesc).end().end()
			.appendTo(setting.$wrapperdiv)
		var $gallerydesctext=setting.$descpanel.find('div.gallerydesctext')
		setting.descpanelheight=$gallerydesctext.outerHeight()
		setting.$descpanel.css({top:-setting.descpanelheight, height:setting.descpanelheight}).find('div').css({height:'100%'})
		return setting.$descpanel.find('div.gallerydesctext').get(0) //return gallery description DIV as a DOM object
	},
	
	addcaptionpanel:function(setting){
	    var slideHeight = this.determineSlideHeight(setting.longestcaption, setting.dimensions[1], setting.dimensions[2]);
		
		setting.$captionpanel=$('<div class="gallerycaption"><div class="gallerycaptionbg"></div><div class="gallerycaptionfg"><div class="gallerycaptiontext"></div></div></div>')
			.css({position:'absolute', width:'100%', left:0, top:-1000, zIndex:'1010'})
			.find('div').css({position:'absolute', left:0, top:0, width:'100%'})
			.eq(0).css({opacity:simpleGallery_navpanel.panel.opacity}).end() //"gallerycaptionbg" div
			.eq(1).css({color:setting.fontcolor, fontFamily:setting.fontfamily, fontWeight:'bold', fontSize:Math.floor(slideHeight/30)}).end() //"gallerycaptionfg" div
			.eq(2).html(setting.longestcaption).end().end()
			.appendTo(setting.$wrapperdiv)
		var $gallerycaptiontext=setting.$captionpanel.find('div.gallerycaptiontext')
		$gallerycaptiontext.css({top:0});
		setting.captionpanelheight=$gallerycaptiontext.outerHeight();
				
				
		//adjust top position
		var topPos;
		if(setting.showGallery){
		    topPos = slideHeight - 35 - setting.captionpanelheight;
		}
		else{
		    var captionPanelHt = setting.captionpanelheight;
		    
		    if(captionPanelHt == 0){
		       captionPanelHt = 25;
		    }
		    
		    topPos = slideHeight - 60 - captionPanelHt;
		}
		
		setting.$captionpanel.find('div.gallerycaptionbg').css({top:topPos});
		setting.$captionpanel.find('div.gallerycaptionfg').css({top:topPos});
		
		setting.$captionpanel.css({top:-setting.captionpanelheight, height:setting.captionpanelheight}).find('div').css({height:'100%'})
		return setting.$captionpanel.find('div.gallerycaptiontext').get(0) //return gallery caption DIV as a DOM object
	},

	getCookie:function(Name){ 
		var re=new RegExp(Name+"=[^;]+", "i"); //construct RE to search for target name/value pair
		if (document.cookie.match(re)) //if cookie found
			return document.cookie.match(re)[0].split("=")[1] //return its value
		return null
	},

	setCookie:function(name, value){
		document.cookie = name+"=" + value + ";path=/"
	},
	
	determineSlideHeight:function(currentLongestCaption, currentHeight, currentHeightWithCaption){
		if (currentLongestCaption!=""){
		   return currentHeightWithCaption;
		}
		else{
		   return currentHeight;
		}
    }
}
