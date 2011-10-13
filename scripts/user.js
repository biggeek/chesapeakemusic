// ----------------------------------------------
// This function dynamically generates flash file
// parameters.
// -----------------------------------------------
function viewFlash(src, w, h, loop, play)
{
   var width = parseInt(w);
   var height = parseInt(h);  
  
//alert('adWidth = '+width+ '\n Height = '+height);

   eval("win = window.open('','Flash', 'toolbar=0,scrollbars=0,location=0,status=0,resizable=1,menubar=0,width="+width+",height="+height+"');");
   win.document.writeln('<html>');
   win.document.writeln('<head><title>Flash Movie</title></head>');
   win.document.writeln('<body>');

   // for IE users use <object> tag
   objectTag = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=5,0,0,0"';
   win.document.write(objectTag);
   win.document.write(' width="'+width+'"');
   win.document.writeln(' height="'+height+'">');
   win.document.writeln('<param name="movie" value="'+src+'">');
   win.document.writeln('<param name="loop" value="'+loop+'">');
   win.document.writeln('<param name="play" value="'+play+'">');

    // for Netscape users use <embed> tag
   win.document.writeln('<embed src="'+src+'" loop="'+loop+'" play="'+play+'" width="'+width+'" height="'+height+'" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" />'); 
   win.document.writeln('</object>');
   win.document.writeln('</body></html>');

}

// ----------------------------------------------
// This function dynamically generates a chat 
// pop-up. (ASV)
// -----------------------------------------------
function viewChat(instance_id, url)
{
   props = 'toolbar=0,scrollbars=0,location=0,status=0,resizable=1,menubar=0,width=584,height=410';
   win = window.open('','Chat',props);
   win.document.writeln('<html>');
   win.document.writeln('<head><title>Chat Room</title></head>');
   win.document.writeln('<body>');
   win.document.writeln('<applet codebase="'+url+'" archive="multichat.jar" CODE="GUIClient.class" width="562" height="385" align="BOTTOM">');
   win.document.writeln('<param name="CABBASE" value="multichat.cab">');
   win.document.writeln('<param name="roomid" value="'+instance_id+'">');
   win.document.writeln('</applet>');
   win.document.writeln('</body></html>');
}

//----------------------------------------------------
// Create a new pop up window for a given URL and type
//----------------------------------------------------
function popUp(URL, type) 
{
    switch(type)
    {
	 case "guestbook":
	    width = 675;
	    height = 500;
	    break;	    
	 case "forum":
	    width = 675;
	    height = 500;
	    break;	    
         default:
            width = 550;
            height = 580;
   }

   var token = URL.indexOf('?') > -1 ? '&amp;' : '?';
   uniqueId = genUniqueId();
   URL=URL+genUniqueParam(token);

   var leftPosition  = (screen.width - width - 20) / 2;
   var topPosition = (screen.height - height) / 4;

   //open centered
   eval("win = window.open(URL, '"+type+"', 'toolbar=0,scrollbars=1,location=0,status=1,resizable=1,menubar=0,width="+width+",height="+height+",left="+leftPosition+",top="+topPosition+"');");

   if (parseInt(navigator.appVersion) >= 4) 
   { 
      win.window.focus(); 
   }
}

//----------------------------------------------------

// Create a new pop up window for a given MLS action 

//----------------------------------------------------

function popUpMLS(id) 

{
   var winWidth = 550;
   var winHeight = 510;
   eval("win = window.open('"+ window.parent.document.getElementById("ic_mls_url"+id).innerHTML +"', name='_blank');");
  
}
//----------------------------------------------------

// Create a new pop up window for a given referral action 

//----------------------------------------------------

function popUpEReferral(id, http, action, subject) 

{
   var winWidth = 550;
   var winHeight = 510;
   eval("win = window.open('','Referral', 'toolbar=0,scrollbars=1,location=0,status=0,resizable=1,menubar=0,width="+winWidth+",height="+winHeight+"');");

   // clear the content of the document
   win.document.open();
   win.document.writeln('<html>');
   win.document.writeln('<head><title>E-Referral Link</title><script language="JavaScript"> function checkemail(){ var toEmail=document.site_refer.ToEmail.value; fromEmail=document.site_refer.FromEmail.value; var filter=/^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$/i; var toEmailArr = new Array(); toEmailArr = toEmail.split(","); var i=0; for (i=0;i<toEmailArr.length;i++) { if(filter.test(toEmailArr[i].replace(/^\\s\\s*/, "").replace(/\\s\\s*$/, ""))){ continue; }else{ alert("Please enter a valid e-mail address (e.g. email@example.com)."); return false; } } if (filter.test(fromEmail)) { return true; } else { alert("Please enter a valid e-mail address (e.g. email@example.com)."); return false; } } function onClickForm(){ document.site_refer.return_url.value=window.location.href; alert("Thank you. Your message has been submitted.");  self.close(); } </script><style type="text/css"> .fName { display:none; }  </style></head>');
   win.document.writeln('<body>');
   win.document.writeln('<h4>Invite People to this Website</h4>');
   win.document.writeln('<h4 style="color:#0000CC">Enter email invitation details</h4>');
   win.document.writeln('<center><table border="0">');
   win.document.writeln('<form onSubmit="return onClickForm();return false;" name="site_refer" action="' +http+ action +'" method="post">');
   win.document.writeln('<input type="hidden" value="" name="return_url"/>');
   win.document.writeln('<div class="fName"><input type="text" name="FirstName" value=""></div></br>');

   win.document.writeln('<table><tr><td><strong>*From Email Address:</strong></td><td><input type="text" style="width:350px;" name="FromEmail" value=""><br/></td></tr>');
   win.document.writeln('<tr><td><strong>Name:</strong></td><td><input type="text" style="width:350px;" name="VisitorName" value=""><br/></td></tr>');
   win.document.writeln('<tr><td><strong>Subject:</strong></td><td><input type="text" readonly style="width:350px;" name="Subject" value="'+ subject +'"><br/></td></tr>');
   win.document.writeln('<tr><td><strong>*To Email Address:</strong></td><td><textarea rows="5" cols="50" style="width:350px;" name="ToEmail"></textarea><br/></td></tr>');
   win.document.writeln('<tr><td><strong>Message:</strong></td><td><textarea rows="10" cols="50" style="width:350px;" readonly name="Message">'+window.parent.document.getElementById("ic_ereferral_mesg"+id).innerHTML+" "+ window.parent.document.getElementById("ic_ereferral_url"+id).innerHTML +'</textarea><br/></td></tr>');
   //win.document.writeln('<textarea rows="10" cols="50" readonly name="Message" >'+mesg+'</textarea><br>');
   //win.document.writeln('<tr><td>&nbsp;</td><td><div style="border: 1px solid #000000; padding: 6px"><b>Subject:</b> '+ subject +'<br><p><b>Message:</b>' + mesg +'</p></div></td></tr>');
   win.document.writeln('<br/><tr><td>&nbsp;</td><td><input type="submit" name="Send" value="Send Invite" onclick="return checkemail();"/>&nbsp;<input type="button" name="Cancel" value="Cancel" onclick="javascript:self.close();"/></td></tr></table>');
   win.document.writeln('</form></table><small>The email address your provide is being used solely to invite people to the website. Network Solutions will not collect your email address for marketing or any other prurposes.</small></center>');
   win.document.writeln('</body></html>');
   win.document.close();
}

// ----------------------
// Generate Unique Id
// ----------------------
function genUniqueId()
{
   day = new Date();
   return day.getTime();
}

// -------------------------------------------------
// Generate Unique parameter to be appended to the URL
// This will allow us to realod the HTML from the server
// -------------------------------------------------
function genUniqueParam(parameter)
{
   return parameter+'unique_id='+genUniqueId();
}

//
// Display the target image for this thumbnail
//
function displayThumb(src, width, height, title)
{
   var winWidth = 650;
   var winHeight = 510;

   eval("win = window.open('','Thumb', 'toolbar=0,scrollbars=1,location=0,status=0,resizable=1,menubar=0,width="+winWidth+",height="+winHeight+"');");

   // clear the content of the document
   win.document.open();

   win.document.writeln('<html>');

   if(null != title && title != "")
   {
       win.document.writeln('<head><title>' + title + '</title></head>');
   }
   else
   {
       win.document.writeln('<head><title>Thumbnail Image</title></head>');
   }
   win.document.writeln('<body>');

   win.document.writeln('<center><table border="0">');
   if (width == 0)
   {
      win.document.writeln('<tr><td align="center"><img src="'+src+'"></td></tr>');
   }
   else if (height == 0)
   {
      win.document.writeln('<tr><td align="center"><img width="'+width+'" src="'+src+'"></td></tr>');   
   } 
   else
   {
      win.document.writeln('<tr><td align="center"><img width="'+width+'" height="'+height+'" src="'+src+'"></td></tr>');   
   } 

   if(null != title && title != "")
   {
       win.document.writeln('<tr><td align="center">'+title+'</td></tr>');
   }
   win.document.writeln('</table></center>');

   win.document.writeln('</body></html>');
   win.document.close();
}
//------------------------------------------------------------
// Create a URL which is called from a mapquest Map to get Directions
//-----------------------------------------------------------
    function genURL(action,formname,newMap, direction)
    {
		var sa = document.getElementById(formname).street_address.value;
		var cy = document.getElementById(formname).city.value;
		var st = document.getElementById(formname).state.value;
		var pc = document.getElementById(formname).postal_code.value;
		var ct = document.getElementById(formname).country.value;
		var lat =document.getElementById(formname).latitude.value;
		var lng =document.getElementById(formname).longitude.value;
		var uid =document.getElementById(formname).userid.value;
		var wid =document.getElementById(formname).website_id.value;
		
		if (newMap=='true'){
		// To be added only if the user is a new user.
			var street=document.getElementById(formname).toStreet.value;
			var city= document.getElementById(formname).toCity.value;
			var state=document.getElementById(formname).toState.value;
			var zip=document.getElementById(formname).toZip.value;
			var country=document.getElementById(formname).toCountry.value;
			if(zip=="")
			{
				if(city=="" || state=="")
				{
					alert("Please select an address by clicking the radio button");
					return false;
				}
			}
		}
		if(pc=="")
		{
			if(cy=="" || st=="")
			{
				alert(ICaltgopub.pe_txt1);
				return false;
			}
		}
		
		
		var fromLocation = sa + "," + cy + "," + st + "," + pc + "," + ct; 
		var toLocation;
		//pallavi change to send the toAress also to get driving directions
		var url = action+"?fromLocation="+fromLocation;
		if (newMap=='true'){
		toLocation = street + "," + city + "," + state + "," + zip + "," + country; 
		//WE have toaddress only for new user,old users used Lat and lon.			
			url=url +"&toLocation="+toLocation ;
		}
		
		if (direction =='reverse'){
		url = action+"?fromLocation=" + toLocation + "&toLocation=" + fromLocation;
		}				
		popUp(url);

   }
//------------------------------------------------------------
// Called from Map Element: This method will set hidden parameters
//-----------------------------------------------------------
    function setToAddress(street,city,state,zip,country,formname)
    {
		document.getElementById(formname).toStreet.value=street;
		document.getElementById(formname).toCity.value=city;
		document.getElementById(formname).toState.value=state;
		document.getElementById(formname).toZip.value=zip;
		document.getElementById(formname).toCountry.value=country;
		
		
  }
 
//------------------------------------------------------------
// Called from Map Element: This method disables the button Id that is passed
//-----------------------------------------------------------
   function disableZoomButton(buttonId,formname,relativepath){
	    switch(buttonId)
	    {
		 case "minus_three":
		   document.getElementById(formname)[buttonId].src=relativepath+'images/photoalbum/zoom-in.png';
		    break;	    
		 case "minus_two":
		    document.getElementById(formname)[buttonId].src=relativepath+'images/photoalbum/zoom-level-button.png';
		    break;
		case "minus_one":
		    document.getElementById(formname)[buttonId].src=relativepath+'images/photoalbum/zoom-level-button.png';
		    break;
		 case "plus_two":
		    document.getElementById(formname)[buttonId].src=relativepath+'images/photoalbum/zoom-level-button.png';
		    break;
		 case "plus_one":
		    document.getElementById(formname)[buttonId].src=relativepath+'images/photoalbum/zoom-level-button.png';
		    break;	
		 case "center":
		    document.getElementById(formname)[buttonId].src=relativepath+'images/photoalbum/zoom-level-button.png';
		    break;		 
		 case "plus_three":
		    document.getElementById(formname)[buttonId].src=relativepath+'images/photoalbum/zoom-out.png';
		    break;	
		 case "original":
		    document.getElementById(formname)[buttonId].src=relativepath+'images/photoalbum/center-map.png';
		    break;
		
	  	 }
   }

//------------------------------------------------------------
// Called from Map Element: This method enables all buttons
//-----------------------------------------------------------  
 function enableAllbutton(formname,relativepath){
 	document.getElementById(formname).minus_three.src=relativepath+'images/photoalbum/zoom-in-over.png';
 	document.getElementById(formname).minus_two.src=relativepath+'images/photoalbum/zoom-level-button-up.png';
 	document.getElementById(formname).minus_one.src=relativepath+'images/photoalbum/zoom-level-button-up.png';
 	document.getElementById(formname).plus_one.src=relativepath+'images/photoalbum/zoom-level-button-up.png';
 	document.getElementById(formname).plus_two.src=relativepath+'images/photoalbum/zoom-level-button-up.png';
 	document.getElementById(formname).plus_three.src=relativepath+'images/photoalbum/zoom-out-over.png';
 	document.getElementById(formname).original.src=relativepath+'images/photoalbum/center-map-over.png';
 	document.getElementById(formname).center.src=relativepath+'images/photoalbum/zoom-level-button-up.png';
   } 
 //------------------------------------------------------------
// Called from Map Element: This is invoked when user clicks zoom buttons or pan buttons
//-----------------------------------------------------------    
    function genZoomURL(pageId,elementId,action,zoomLevel,symbolName,formname,panDirection,relativepath)
    {
		  enableAllbutton(formname,relativepath);
		  disableZoomButton(zoomLevel,formname,relativepath);
		  
		  var uniqueId = genUniqueId();
		  var url = action+"page_id="+pageId+"&element_id="+elementId
							+ "&symbolName=" +symbolName+"&zoomLevel=" + zoomLevel 
							+ "&panDirection=" + panDirection 
							+ "&uniqueId=" +uniqueId;
							
		//popUp(url);
		var divImageName= 'mapImage'+	elementId;	
		document.getElementById(divImageName).style.display='none';
		var divZoomName= 'zoomDiv'+	elementId;	
		document.getElementById(divZoomName).style.display='block';
		var iframeZoomName= 'zoomImageFrame'+	elementId;	
		document.getElementById(iframeZoomName).src=url;
	      
					
   }
   

 
/*
	Developed by Robert Nyman, http://www.robertnyman.com
	Code/licensing: http://code.google.com/p/getelementsbyclassname/
*/	
var getElementsByClassName = function (className, tag, elm){
	if (document.getElementsByClassName) {
		getElementsByClassName = function (className, tag, elm) {
			elm = elm || document;
			var elements = elm.getElementsByClassName(className),
				nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
				returnElements = [],
				current;
			for(var i=0, il=elements.length; i<il; i+=1){
				current = elements[i];
				if(!nodeName || nodeName.test(current.nodeName)) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	else if (document.evaluate) {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = "",
				xhtmlNamespace = "http://www.w3.org/1999/xhtml",
				namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
				returnElements = [],
				elements,
				node;
			for(var j=0, jl=classes.length; j<jl; j+=1){
				classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
			}
			try	{
				elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
			}
			catch (e) {
				elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
			}
			while ((node = elements.iterateNext())) {
				returnElements.push(node);
			}
			return returnElements;
		};
	}
	else {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = [],
				elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
				current,
				returnElements = [],
				match;
			for(var k=0, kl=classes.length; k<kl; k+=1){
				classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
			}
			for(var l=0, ll=elements.length; l<ll; l+=1){
				current = elements[l];
				match = false;
				for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
					match = classesToCheck[m].test(current.className);
					if (!match) {
						break; 
					}
				}
				if (match) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	return getElementsByClassName(className, tag, elm);
};
	
	//Cross Browser Event Attachment
	function addEvent(el, evType, handle, capture){
	    
		var bubbleCapture = capture == null ? false : capture;
		
		if(el.addEventListener)el.addEventListener(evType, handle, bubbleCapture);
	    else if(el.attachEvent){
	        el["e" + evType + handle] = handle;
	        el[evType + handle] = function(){el["e" + evType + handle](window.event)}
	
	        el.attachEvent("on" + evType, el[evType + handle]);
	    }
	} 
	
	function getImmediateChildren(node, tagName)
	{
		if(!node || !node.childNodes) return;
		if(!tagName) tagName = "*";
		var elements = document.getElementsByTagName(tagName);
		var nodeCount = elements.length;
		var children = new Array();
		for(var i=0;i<nodeCount;i++)
		{
			if(elements[i].parentNode == node)
			{
				children[children.length] = elements[i];
			}
		}
		return children;
	}

	

//-----------
// BEGIN SCRIPTS FOR NAV MENUS
//-----------

	var icMenuTimeout = null;  //use this to turn off menu
	
	function initClientMenu(){
		
		// showmenu function to show the submenu on mouseover of main menu
		var showMenu = function() {
  			//get the position of the placeholder element
 			var pos = $(this).offset();  
  			var width = $(this).width();// make width be innerWidth to include padding
  			//var width = $(this).innerWidth();
			var height = $(this).innerHeight();	
  			var submenu = $(this).children("div");
			var menuFloat = null;

			if($('#wb-layout-sidebar').css("display") != 'none'){
				menuFloat = $('#wb-layout-sidebar').css("float");
			} else if((($('#wb-layout-top-2').css("display") != 'none') && ($('#wb-header-nav').css("display") == 'none') && ($('#wb-layout-top-header').css("display") == 'none'))
					|| (($('#wb-layout-top-2').css("display") != 'none') && ($('#wb-header-nav').css("display") != 'none') && ($('#wb-layout-top-header').css("display") != 'none'))){
				menuFloat = "top";
			}else if($('#wb-header-nav').css("display") != 'none'){	
				menuFloat = $('#wb-header-nav').css("float")+"New";
			}else if($('#wb-layout-top-header').css("display") != 'none'){
				menuFloat = "topNew";
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
			}
			//show the submenu on different position based on main menu's position 
  			if(menuFloat == 'left')
				submenu.css( {"position":"absolute", "left": (pos.left + width) + "px", "top":pos.top + "px", "width": width, "z-index":2000});
			else if(menuFloat == 'right') 
				submenu.css( {"position":"absolute", "left": (pos.left - width) + "px", "top":pos.top + "px", "width": width, "z-index":2000});
			else if(menuFloat == 'top')
				submenu.css( {"position":"absolute", "left": (pos.left) + "px", "top":(pos.top + height) + "px", "z-index":2000});
			else if(menuFloat == 'leftNew')
				submenu.css( {"position":"absolute", "left": (width) + "px", "top":pos.top + "px", "width": width, "z-index":2000});
			else if(menuFloat == 'rightNew')
				submenu.css( {"position":"absolute", "left": (- width) + "px", "top":pos.top + "px", "width": width, "z-index":2000});
			else if(menuFloat == 'topNew')
				submenu.css( {"position":"absolute", "left": ($(this).position().left) + "px", "top":(pos.top + height) + "px", "z-index":2000});
  			submenu.show();
		}
		// hidemenu function to hide the submenu 
		var hideMenu = function() {
			var submenu = $(this).children("div");
                	setTimeout(function() {
    				submenu.hide();
			},300);
		}
		
		// get all menu div for superheader menu
		var superheaderGroup = $('#wb-navigation-bottom-header > div');
		// get all menu div for sidebar menu
		var sidebarGroup = $('#wb-navigation-bottom > div');
	        // get all menu div for subtop menu
		var topbarGroup = $('#wb-navigation-subtop > div');
		 // get all menu div for subtop menu
		var topheaderbarGroup = $('#wb-navigation-subtop-header > div');
		// get all menu div for supertop menu
		var supertopbarGroup = $('#wb-navigation-supertop > div');
		
		superheaderGroup.hover(showMenu, hideMenu);
		sidebarGroup.hover(showMenu, hideMenu);
		topbarGroup.hover(showMenu, hideMenu);
		topheaderbarGroup.hover(showMenu, hideMenu);
		supertopbarGroup.hover(showMenu, hideMenu);
		
		//hide all submenus after pages loads
		superheaderGroup.mouseout();
		sidebarGroup.mouseout();
		topbarGroup.mouseout();
		topheaderbarGroup.mouseout();
		supertopbarGroup.mouseout();
        return false;	
	}
	
	function persistMenu(ev) {
		if (ev == null) { ev = window.event; } 
		      evtObj = ev.target != null ? ev.target : ev.srcElement;
		
	
		window.clearTimeout(icMenuTimeout);	
	
		
	}
	
	function openMenu(ev) {
		if (ev == null) { ev = window.event; } 
		      evtObj = ev.target != null ? ev.target : ev.srcElement;
		
		var otherSubmenus = getElementsByClassName('submenu');
		
		for(i=0; i<otherSubmenus.length; i+=1) {

				otherSubmenus[i].style.display = 'none';
		
		}	
		
	}
	
	function closeMenus(ev) {
		if (ev == null) { ev = window.event; } 
		      evtObj = ev.target != null ? ev.target : ev.srcElement;
			 
		var submenus = getElementsByClassName('submenu');
		
		icMenuTimeout = window.setTimeout(function() {
			for(j=0; j<submenus.length; j+=1) {
				submenus[j].style.display = 'none';
			}
		},300);
		
	}
	
	//initClientMenu();
//-----------
// END SCRIPTS FOR NAV MENUS
//-----------



//var colheightofs = 31;
var colheightofs = 0;
var pngXOffset=0;
var pngYOffset=0;
function sizeColumns() {

if (window.pngHeight) {
	pngHeight();
}

if (!document.getElementById('column1')){
	return;
}

coldvht1=document.getElementById('column1').offsetHeight;
coldvht2= document.getElementById('column2') ? document.getElementById('column2').offsetHeight : 0;
coldvht3=document.getElementById('column3') ? document.getElementById('column3').offsetHeight : 0;


if (coldvht1>coldvht2) coldvht2=coldvht1;
else if (coldvht2>=coldvht1) coldvht1=coldvht2;
if (coldvht3>=coldvht1) 
{
  coldvht1=coldvht3;
  coldvht2=coldvht3;
}
else 
{
  coldvht3=coldvht1;
}

coldvht3=coldvht1;
coldvht2=coldvht1;

document.getElementById('colbody1').style.height = (coldvht1 - colheightofs) + 'px';

	if(document.getElementById('colbody2')) {	
		document.getElementById('colbody2').style.height = (coldvht2 - colheightofs) + 'px';
		return;
	}
	
	if(document.getElementById('colbody3')) {
		document.getElementById('colbody3').style.height = (coldvht3 - colheightofs) + 'px';	
	}
}
