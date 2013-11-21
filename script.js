$(function(){
	// Variable to keep track of our returned ajax results
	var currData;

	$('#btn-search').on('click', getListings);
	// Use "delegation" so newly added items will still fire clicks
	$('#listings').on('click', 'li', showListing);

	function getListings(){
		$('#listings').empty();
		// TODO: Add "loading" indicator
		$.get('http://reddit.com/r/' + $('#txt-search').val() + '.json', parseListings);
	}

	function parseListings(data){
		data = data.data;
		currData = data;
		$.each(data.children, function(idx, listing){
			listing = listing.data;
			$('#listings').append('<li>' + listing.title + '</li>');
		});
	}

	function showListing(evt){
		var $item = $(this);
		// Hide it if it's already open
		if ($item.find('.details').size() > 0){
			$item.find('.details').remove();
			return;
		}
		var listing = currData.children[$item.index()].data;
		var details = listing.selftext_html;
		var thumbnail = listing.thumbnail;
		var link = listing.url;

		// Create container
		var $detailsContainer = $('<div>').addClass('details')

		if (details != null){
			// unescape HTML entities
			details = $("<div/>").html(details).text();
			// Add details
			$detailsContainer.html(details);
		}

		if (thumbnail != 'default' && thumbnail != 'self'){
			var $thumbnail = $('<img>').addClass('thumbnail').attr('src', thumbnail);
			$detailsContainer.append($thumbnail);
		}

		if (link.indexOf('http://www.reddit.com') == -1) { // If it's not going to redirect to the same listing url
			var $link = $('<a>')
				.addClass('link')
				.attr({
					'href':'#', 
					'onclick':'window.open(\'' + link + '\', \'_system\');'
				})
				.html('Go to link');
			$detailsContainer.append($link);
		}

		$item.append($detailsContainer);
	}
});
