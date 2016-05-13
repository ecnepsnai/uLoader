// The order of javascripts loading does matter
LoadScript("scripts/utils.js");
LoadScript("scripts/links_storage.js");
LoadScript("scripts/filters_builder.js");
LoadScript("scripts/footer_builder.js");
LoadScript("scripts/links_builder.js");
LoadScript("scripts/page_builder.js");
LoadScript("scripts/handlers.js");
LoadScript("scripts/globals.js");
LoadScript("scripts/main.js");


// Just append a script elemnt to the HTML body
function LoadScript(scriptName) {
    var elm = document.createElement('script');
    elm.type = "text/javascript";
    elm.src = scriptName;
    document.body.appendChild(elm);
}
