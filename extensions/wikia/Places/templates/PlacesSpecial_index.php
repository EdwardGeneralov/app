<div id="places-dynamic-map" style="width:100%; height:500px"></div>
<?
	echo F::build('JSSnippets')->addToStack(
		array( 
			'/extensions/wikia/Places/js/Places.js',
		),
		array( '$.loadGoogleMaps'),
		'Places.displayDynamic',
		array( 'markers' => $markers, 'center' => $center )
	);
?>
