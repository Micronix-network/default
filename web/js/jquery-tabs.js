(function($) {

	$.fn.gaftabs = function(options) {

		var settings = $.extend({
			text : 'Hello, World!',
			color : null,
			show : null
		}, options);

		var $active, $content, $links = $(this).find('a');

		return this.each(function() {

			$active = $($links.filter('[href="' + location.hash + '"]')[0] || $links[0]);
			$active.addClass('active');
			$content = $($active.attr('href'));
			$links.not($active).each(function() {
				$($(this).attr('href')).hide();
			});

			$(this).on('click', 'a', function(e) {
				$active.removeClass('active');
				$content.hide();

				$active = $(this);
				$content = $($(this).attr('href'));

				$active.addClass('active');
				$content.show();
				if ( $.isFunction( settings.show ) ) {
			        settings.show.call( $content );
			    }
				
				e.preventDefault();
				e.stopPropagation();
			});

		});

	};

})(jQuery);