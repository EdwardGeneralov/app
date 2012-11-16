(function($, window){

	var $section = $('#RelatedForumDiscussion'),
		$content = $section.find('.forum-content'),
		$window = $(window);
		
	$section.find('.button.forum-new-post').tooltip();
	
	/* check if content is 3 windows above */
	function isBelowTheFold() {
		return $section.offset().top > ($window.scrollTop() + ($window.height() * 3) );
	};
	
	// if user is not logged in, check for cache, and replace if needed
	if(!window.wgUserName) {
		function loadRelatedDiscussion() {
			$.nirvana.sendRequest({
				controller: 'RelatedForumDiscussionController',
				method: 'checkData',
				format: 'json',
				data: {
					articleId: window.wgArticleId ? window.wgArticleId:0 
				},
				callback: function(json) {
					if(json && json.replace) {
						$content.html(json.html);
					} 
					$content.removeClass('forum-invisible');
				}
			});
		}

		if(!isBelowTheFold()) {
			loadRelatedDiscussion();
		} else {
			$window.on('scrollstop.RelatedForumDiscussion', function() {
				if(!isBelowTheFold()) {
					$window.off('scrollstop.RelatedForumDiscussion');
					loadRelatedDiscussion();
				}
			});
		}

	}
	
})(jQuery, window);