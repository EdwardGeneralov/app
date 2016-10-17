jsWC=window.jsWC || {}; jsWC["./extensions/SemanticResultFormats/formats/Exhibit/exhibit/locales/de/scripts/ui/widgets/collection-summary-widget-l10n.js"]=1068;

/*==================================================
 *  Exhibit.CollectionSummaryWidget German localization
 *==================================================
 */

if (!("l10n" in Exhibit.CollectionSummaryWidget)) {
    Exhibit.CollectionSummaryWidget.l10n = {};
}

Exhibit.CollectionSummaryWidget.l10n.resetFiltersLabel = "Alle Filter zur�cksetzen";
Exhibit.CollectionSummaryWidget.l10n.resetFiltersTooltip = "Alle Filter zur�cksetzen und urspr�ngliche Elemente anzeigen";
Exhibit.CollectionSummaryWidget.l10n.resetActionTitle = "Alle Filter zur�cksetzen";

Exhibit.CollectionSummaryWidget.l10n.allResultsTemplate =
    "<span class='%0' id='resultDescription'></span>";

Exhibit.CollectionSummaryWidget.l10n.noResultsTemplate =
    "<span class='%0'><span class='%1'>0</span> Ergebnisse</span> (<span id='resetActionLink'></span>)";

Exhibit.CollectionSummaryWidget.l10n.filteredResultsTemplate =
    "<span class='%0' id='resultDescription'></span> " +
    "gefiltert von urspr�nglich <span id='originalCountSpan'>0</span> (<span id='resetActionLink'></span>)";
