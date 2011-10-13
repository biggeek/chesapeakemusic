function initGallery(galElId, galWidth, galHeight, relPath, bgColor, capColor, capFont,showGallery, autoplay, browsingControls, slideshowDelay) {

	var imageList = getImageList(galElId + "_thumbs", galWidth, galHeight, browsingControls);
	var height = galHeight;
	var heightWithCaptionPanel = galHeight;
	var heightOfNavPanel =35;
	var heightOfCaptionPanel =35;
	//The controls are shown all the time we want gallery to be bigger and display controls at bottom of pic
	if (browsingControls){
		height = galHeight + heightOfNavPanel + Math.floor(galHeight/25);
		heightWithCaptionPanel = galHeight + heightOfNavPanel + heightOfCaptionPanel + Math.floor(galHeight/25);
	}
	
	var myGallery = new simpleGallery({
		wrapperid: galElId + "_gallery", //ID of main gallery container,
		dimensions: [galWidth, height, heightWithCaptionPanel], //width/height of gallery in pixels. Should reflect dimensions of the images exactly
		imagearray: imageList,
		relpath: relPath,	
		bgcolor: bgColor,
		fontfamily: capFont,
		fontcolor: capColor,
		showControls : browsingControls,
		showGallery: showGallery,				
		autoplay: [autoplay, slideshowDelay, 200], //[auto_play_boolean, delay_btw_slide_millisec, cycles_before_stopping_int]
		persist: false, //remember last viewed slide and recall within same session?
		fadeduration: 500, //transition duration (milliseconds)
		oninit:function(){ //event that fires when gallery has initialized/ ready to run
			//Keyword "this": references current gallery instance (ie: try this.navigate("play/pause"))
		},
		onslide:function(curslide, i){ //event that fires after each slide is shown
			//Keyword "this": references current gallery instance
			//curslide: returns DOM reference to current slide's DIV (ie: try alert(curslide.innerHTML)
			//i: integer reflecting current image within collection being shown (0=1st image, 1=2nd etc)
		}
	});

	return myGallery;
}

function getImageList(elemId, galWidth, galHeight , browsingControls){
	var imgArray = $('#' + elemId).find('img');
	var paramArray = new Array(imgArray.length);
	imgArray.each(function(i){
		paramArray[i] = [	this.attributes['source_path'].value,
		                    "",
		                    "",
							this.attributes['title'].value,
							getFittedDimension(this.attributes['orig_width'].value,this.attributes['orig_height'].value,galWidth,galHeight),
							getTopOffset(this.attributes['orig_width'].value,this.attributes['orig_height'].value,galWidth,galHeight , browsingControls),
							this.attributes['caption'].value];
							
	});
	return paramArray;
}

function getFittedDimension(width, height, galWidth, galHeight){
	if((height > 0) && (galHeight > 0)){
		if((width < galWidth) && (height < galHeight)){
			return ' width="' + width + 'px"';

		}else if((width/height) > (galWidth/galHeight)){ //image width ratio is larger
			return ' width="' + galWidth + 'px"';

		}else{  //height ratio is larger
			return ' height="' + galHeight + 'px"';
		}
	}
	return "";
}

function getTopOffset(width, height, galWidth, galHeight, browsingControls){
		var offSet;
		var marginValue = 0;
		if((height > 0) && (galHeight > 0)){
			if((width < galWidth) && (height < galHeight)){
				marginValue= Math.floor((galHeight-height)/2 ) ;
			}else if((width/height) > (galWidth/galHeight)){ //image width ratio is larger... determine ratio to shrink height and pad
				marginValue= Math.floor((galHeight-((galWidth/width)*height))/2) ;
			}
		}
		//If browisng control shown all the time we want image to appear below the desc panel in gallery
		
		if (browsingControls){
			marginValue = Math.floor(marginValue + (galHeight/25));
			}
		offSet= "margin:" + marginValue + "px 0px;";
		return offSet;
}
	
function getThumbWidth(elemId) {

		var divArray = $('#' + elemId).find('div');
        var widthVal = 0;

		if(divArray){
           if(divArray[0].offsetWidth > 0){
              widthVal = (divArray[0].offsetWidth - 1);
           }
		}
		return widthVal;

}

$(window).bind("load", function() {
	//get all albums
	$(".wb_element_pa").each(function(i){
		var thumbLayout = this.attributes['thumblayout'].value;
		var heightFactor = 0;
		switch(thumbLayout){
			case "square":  //Slideshow with Thumbs
				heightFactor = 1;
				break;
			case "landscape":
				heightFactor = 0.75;
				break;
			case "portrait":
				heightFactor = 1.5;
				break;
			default:
				heightFactor = 0.75;
		}
		
		var albumElId = this.id;
		var galWidth = this.offsetWidth;
		var galHeight = Math.floor(heightFactor * galWidth);

	 	var relPath = this.attributes['relative_file_path'].value;
		var bgColor = this.attributes['bg_color'].value;
		var capColor = this.attributes['text_color'].value;
		var capFont = this.attributes['text_font_family'].value;
					
		var thumbWidth = getThumbWidth(this.id + "_thumbs");
		var thumbHeight = Math.floor(heightFactor * thumbWidth);
		var thumbRatio = thumbWidth/thumbHeight;		
		var autoplay = this.attributes['autoplay'].value;
		//Make sure that old photo album which doesnot have the autoplay and slideshow attributes work as before
		if (autoplay !==""){
			if (autoplay ==='true'){
				autoplay=true;
			}else{
				autoplay=false;
			}
		}else{
			// default is start album in play mode
			autoplay=true;
		}
		
		var browsingControls =this.attributes['browsing_controls'].value;
		if (browsingControls !==""){
			if (browsingControls ==='true'){
				browsingControls=true;
			}else{
				browsingControls=false;
			}
		}else{
			//deafult is not show all the time
			browsingControls=false;
		}	
		
		var slideshowDelay = this.attributes['slideshow_delay'].value;
		if (slideshowDelay === ''){
			slideshowDelay = 4500
		}
		
		
		var albumId = this.id;
		var thumbDivId = albumId + '_thumbs'; 
	
		$('#' + thumbDivId + ' div').each(function(i) {
	      if(this.className == 'wb_element_paThumbBlock'){
		            $(this).height(thumbHeight);  
		            $(this).css('backgroundColor', bgColor);
		      }else if(this.className == 'wb_element_paThumbContainer'){
		            $(this).css("margin", Math.floor(0.02*galWidth));
		      }else{ //caption div
		            $(this).height(thumbHeight/2);      
		            $(this).css('font-size', Math.floor(thumbWidth/8) + 'px'); 
		            $(this).css('font-family', capFont);                                      
		      }

			});   

				
		switch(this.attributes['album_type'].value){
			case "1":  //Slideshow with Thumbs
 				var showGallery = true;
				var myGallery = initGallery(this.id, galWidth, galHeight, relPath, bgColor, capColor, capFont,showGallery, autoplay, browsingControls, slideshowDelay);
				myGallery.start();
								
				$('#' + thumbDivId + ' img').each(function(i) {		
					$(this).css("cursor", "pointer");
					
					var imgRatio = this.attributes['thumb_width'].value/this.attributes['thumb_height'].value;

					if ((this.attributes['thumb_width'].value < thumbWidth) && (this.attributes['thumb_height'].value < thumbHeight)){ //image already fits... middle align

						$(this).width(this.attributes['thumb_width'].value + 'px');
						$(this).height(this.attributes['thumb_height'].value + 'px');
						 $(this).css("margin", Math.floor((thumbHeight - this.height)/2) + 'px 0px');
						

					} else if(imgRatio > thumbRatio){ //image width ratio is larger

						$(this).width(thumbWidth);
						$(this).height(Math.floor(thumbWidth / imgRatio));
						 $(this).css("margin", Math.floor((thumbHeight - this.height)/2) + 'px 0px');

																							
					}else{

						$(this).width(Math.floor(imgRatio * thumbHeight));
						$(this).height(thumbHeight);
					}	
										
					$(this).click(function(){
						myGallery.navigate(i);
					});
				});
				break;
 
			case "2":  //Slideshow Only
				var showGallery = true;
				var myGallery = initGallery(this.id, galWidth, galHeight, relPath, bgColor, capColor, capFont,showGallery, autoplay, browsingControls, slideshowDelay);
				myGallery.start();
				break;

			case "3":  //Thumbs Only
				var showGallery = false;
				
				var myGallery = initGallery(this.id, galWidth, galHeight, relPath, bgColor, capColor, capFont,showGallery, autoplay, browsingControls, slideshowDelay);
				myGallery.start();
				
				$('#' + thumbDivId + ' img').each(function(i) {
					$(this).css("cursor", "pointer");

					var imgRatio = this.attributes['thumb_width'].value/this.attributes['thumb_height'].value;

					if ((this.attributes['thumb_width'].value < thumbWidth) && (this.attributes['thumb_height'].value < thumbHeight)){ //image already fits... middle align			

						$(this).width(this.attributes['thumb_width'].value + 'px');
						$(this).height(this.attributes['thumb_height'].value + 'px');
						$(this).css("margin-top", Math.floor((thumbHeight - this.height)/2));
						
					} else if(imgRatio > thumbRatio){ //image width ratio is larger
						$(this).width(thumbWidth);
						$(this).height(Math.floor(thumbWidth / imgRatio));
						$(this).css("margin-top", Math.floor((thumbHeight - this.height)/2));
																							
					}else{
						$(this).width(Math.floor(imgRatio * thumbHeight));
						$(this).height(thumbHeight);
					}	
															
					$(this).click(function(){
						$('#' + albumId + '_galleryHolder').css("y", $('#' + thumbDivId).position().top);
						$('#' + albumId + '_galleryHolder').css("display", "block");
						myGallery.navigate(i);					
					});
				});
				break;

			default:
				alert('def');
		}
	});
});
