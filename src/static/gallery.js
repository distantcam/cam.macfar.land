$(".gallery").each(function(i, el) {
	var rowHeight = $(el).hasClass('big') ? 250 : 150;

	$(el).justifiedGallery({
		captions: true,
		rowHeight,
		selector: 'figure, > div:not(.spinner)',
		rel: 'gallery-' + i,
		margins: 0,
		randomize: true,
		lastRow: 'justify',
	});
});
