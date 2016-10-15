window.rhfs=window.rhfs||[];rhfs.push('./extensions/SemanticResultFormats/formats/Exhibit/exhibit/locales/nl/scripts/util/views-l10n.js');
/*==================================================
 *  Exhibit.ViewUtilities English localization
 *==================================================
 */

if (!("l10n" in Exhibit.ViewUtilities)) {
    Exhibit.ViewUtilities.l10n = {};
}

Exhibit.ViewUtilities.l10n.unplottableMessageFormatter = function(totalCount, unplottableItems, uiContext) {
    var count = unplottableItems.length;

    return String.substitute(
        "<a class='exhibit-action exhibit-views-unplottableCount' href='javascript:void' id='unplottableCountLink'>%0</a> "+
        "van <class class='exhibit-views-totalCount'>%1</span>  kan niet worden afgebeeld.",
        [ count == 1 ? (count + " result") : (count + " results"), totalCount ]
    );
};
