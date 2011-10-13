<?php

if(!function_exists("call_rssNewsFeed")){
function call_rssNewsFeed ($rssUrl, $no_of_items, $show_description, $show_date, $font_face, $font_size, $font_color, $text_align, $bgcolor, $bordercolor, $borderwidth, $showCNN, $showWall , $showForbes , $showMsn, $showYahoo) {

   call_rssReader($rssUrl, $no_of_items, $show_description, $show_date, $font_face, $font_size, $font_color, $text_align, $bgcolor, $bordercolor, $borderwidth);
}
}

if(!function_exists("call_rssReader")){
function call_rssReader ($rssUrl, $no_of_items, $show_description, $show_date, $font_face, $font_size, $font_color, $text_align, $bgcolor, $bordercolor, $borderwidth) {

	clearstatcache();
	$rss_url = $rssUrl; 

	$max_rss_items_required =  $no_of_items; 

	$show_description = $show_description; 

	$show_date = $show_date; 

	$font_face = $font_face; 

	$font_size = $font_size; 

	$font_color = $font_color; 

	$text_align = $text_align; 

	$bg_color = $bgcolor; 

	$border_color = $bordercolor; 

	$border_width = $borderwidth; 

	$xml_feed_array = array();
	$result = "";

	if($rss_url == "" || $rss_url == null){
		$result = "false";
	}

	//get the rss_url and store the multiple rss feeds in a array.
	$token = strtok($rss_url, "+");
	while ($token !== false)
	  {
	  //echo "--$token<br />";
	  array_push($xml_feed_array, trim($token));
	  $token = strtok("+");
	  }

	$total_feed = sizeof($xml_feed_array);
	$received_rss_feeds = "";

	$rss_feed_title_array = array();
	$rss_feed_url_array = array();
	$rss_feed_description_array = array();
	$rss_feed_pubdate_array = array();
	$rss_feed_pubdate_array_temp = array();

	foreach($xml_feed_array as $received_rss_feeds ){
		// We can now parse the individual RSS feed items.

		/*
		We will tap into the elegance of the PHP SimpleXML API to
		parse these RSS feeds encoded in XML format.
		
		There are multiple versions of RSS out there namely 0.91, 0.92, 1.0 and 2.0
		The basic difference between these versions comes down to one of the following two formats.
		
		1) <rss><channel><item>...</item><item>...</item><item>...</item></channel></rss>
		2) <rdf><channel>...</channel><item>...</item><item>...</item><item>...</item></rdf>
		
		In format 1, <item> elements are the children of the <channel> element.
		In format 2, <item> elements are direct children of the root element <rss> or <rdf>.
		In other words, in format 2, <item> elements are siblings of the <channel> element. 
		RSS version 1.0 uses format 2, whereas all the other versions follow format 1.
		In both these formats, we are interested only in the children between <item>...</item>.
		Our parsing logic here should handle both of these formats.	
		*/	

		if(substr_count($received_rss_feeds, amp) != 0){
			$result = "false";
		}
		// To begin with load the XML file to get a SimpleXML object representation.
		
//		$xml = simplexml_load_file($received_rss_feeds);

                $curl_handle=curl_init();
                curl_setopt($curl_handle,CURLOPT_URL,$received_rss_feeds);
                curl_setopt($curl_handle,CURLOPT_CONNECTTIMEOUT,100);
                curl_setopt($curl_handle,CURLOPT_RETURNTRANSFER,true);
                curl_setopt($curl_handle, CURLOPT_FOLLOWLOCATION, true);
                $content = curl_exec($curl_handle);
                curl_close($curl_handle);

                $xml = simplexml_load_string($content);

		// Is it a valid XML document.
		//if ((is_object($xml) == false) || (sizeof($xml) <= 0)) {	
			// XML parsing error. Return now.
			//$result = "false";
		//} // End of if ((is_object($xml) == false) ...
		
		// Now we have to determine, if we have the <item> elements as the 
		// children of the <channel> element i.e. Format 1 above or
		// if we have the <item> elements as the direct children of the 
		// <rss> or <rdf> root element i.e. Format 2 above.
		//$obj1 = $xml->item;
		
		//if ((is_object($obj1) == false) || (sizeof($obj1) <= 0)) {
			// <item> elements are not direct children of the document root element.
			// In that case, it is not format 2. It should be as in format 1.
			// Move to the <channel> element so that that will be our new root.
			$xml = $xml->channel;
		//} // End of if ((is_object($obj1) == false) ...

		// Stay in a loop and collect the details from the <item> elements.
		foreach ($xml->item as $item) {
			// At this stage, we have access to the <item> elements one at a time.
			// We don't know how many <item> elements are there. 
			// Let us read the title, link and description elements.
			$rss_feed_title = trim(strval($item->title));
			$rss_feed_url = trim(strval($item->link));
			$rss_feed_description = trim(strval($item->description));
			$rss_feed_pubdate = trim(strval($item->pubDate));

			 // Let us now add these values to the array references we have.
			 array_push($rss_feed_title_array, $rss_feed_title);
			 array_push($rss_feed_url_array, $rss_feed_url);
			 array_push($rss_feed_description_array, $rss_feed_description);
			 array_push($rss_feed_pubdate_array, $rss_feed_pubdate);
		 }
			$result = "true";

	}
		
	if($result == "true"){
		foreach($rss_feed_pubdate_array as $date ){
			array_push($rss_feed_pubdate_array_temp, strtotime($date));
			
		}

	    array_multisort($rss_feed_pubdate_array_temp, SORT_DESC, $rss_feed_pubdate_array, $rss_feed_title_array, $rss_feed_url_array, $rss_feed_description_array);
	?>

		<table border="<? echo $border_width ?>" <? if($bg_color !='transparent'){ ?> bgcolor="#<? echo $bg_color ?>" <? } if($border_color !='transparent'){ ?> bordercolor="#<? echo $border_color; ?>" <? } ?> style="font-size:<? echo $font_size ?>; font-face:<? echo $font_face ?>;color:#<? echo $font_color ?>">

			<tr height="20%" align="center">
				<td valign="top">
				<strong>
				<br />
				Latest Top (<? echo  $max_rss_items_required; ?>) News
				</strong>
				</td>
			</tr>
			<tr height="70%" align="<? echo $text_align; ?>">
				<td valign="top">
				<?
				// Stay in a loop and write the title, URL and Description.
				for($cnt=0; $cnt < $max_rss_items_required; $cnt++) {
					
					if($rss_feed_title_array[$cnt] == null || $rss_feed_title_array[$cnt] ==''){
						break;
					}
					printf( "\t<hr><br /><b><a href='%s' target='_blank'>%s</a></b>\n", trim( $rss_feed_url_array[$cnt] ), htmlspecialchars( trim( $rss_feed_title_array[$cnt] ) ) );
					if($show_description == 'true'){
							printf( "\t<br />%s<br />\n",  trim( $rss_feed_description_array[$cnt] ) );
					}
					if($show_date == 'true'){
							printf( "\t<br />%s<br />\n",  trim( $rss_feed_pubdate_array[$cnt] ) );
					}
				} // End of for($cnt=0; $cnt < sizeof($rss_feed_title_array), $cnt++)
				?>

				</td>
			</tr>
		</table>
	<?
	}else{
		echo "<br /><b>RSS Feed is unavailable.</b>";
	}
}
}
?>
