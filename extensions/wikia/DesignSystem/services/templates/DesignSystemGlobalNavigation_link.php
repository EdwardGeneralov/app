<a href="<?= Sanitizer::encodeAttribute( $model['href'] ); ?>"
	class="wds-global-navigation__link"
	data-tracking-label="<?= Sanitizer::encodeAttribute( $model['tracking-label'] ) ?>">
	<?= DesignSystemHelper::renderText( $model['title'] ) ?>
</a>
