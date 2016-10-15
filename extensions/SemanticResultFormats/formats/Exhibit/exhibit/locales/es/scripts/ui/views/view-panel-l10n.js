window.rhfs=window.rhfs||[];rhfs.push('./extensions/SemanticResultFormats/formats/Exhibit/exhibit/locales/es/scripts/ui/views/view-panel-l10n.js');
/*==================================================
 *  Exhibit.ViewPanel Spanish localization
 *==================================================
 */

if (!("l10n" in Exhibit.ViewPanel)) {
    Exhibit.ViewPanel.l10n = {};
}

Exhibit.ViewPanel.l10n.createSelectViewActionTitle = function(viewLabel) {
    return "selecciona " + viewLabel + " vista";
};
Exhibit.ViewPanel.l10n.missingViewClassMessage = "En la especificación de una de las vistas falta el campo viewClass.";
Exhibit.ViewPanel.l10n.viewClassNotFunctionMessage = function(expr) {
    return "El valor del atributo viewClass '" + expr + "' espeficicado\n" +
        "en una de las vistas no se corresponde con una función Javascript.";
};
Exhibit.ViewPanel.l10n.badViewClassMessage = function(expr) {
    return "El valor del atributo viewClass '" + expr + "' especificado\n" +
        "en una de las vistas no es una expresión Javascript válida.";
};
