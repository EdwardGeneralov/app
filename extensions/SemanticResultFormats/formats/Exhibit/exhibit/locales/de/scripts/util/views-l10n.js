jsWC=window.jsWC || {}; jsWC["./extensions/SemanticResultFormats/formats/Exhibit/exhibit/locales/de/scripts/util/views-l10n.js"]=736;

/*==================================================
 *  Exhibit.ViewUtilities German localization
 *==================================================
 */

if (!("l10n" in Exhibit.ViewUtilities)) {
    Exhibit.ViewUtilities.l10n = {};
}

Exhibit.ViewUtilities.l10n.unplottableMessageFormatter = function(totalCount, unplottableItems, uiContext) {
    var count = unplottableItems.length;

    return String.substitute(
        "<a class='exhibit-action exhibit-views-unplottableCount' href='javascript:void' id='unplottableCountLink'>%0</a> "+
        "von <class class='exhibit-views-totalCount'>%1</span> k�nnen nicht angezeigt werden.",
        [ count == 1 ? (count + " Ergebnis") : (count + " Ergebnisse"), totalCount ]
    );
};
