$(function() {

    $(".tab-pane[id*=-text]").each(function (i, el) {

        var escapeHTML = function( code ) {
            return code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        };

        var liveId = $(el).attr("id").replace("-text", "-live");
        var codeId = liveId.replace("-live", "-code");
        var text = $.trim($(el).find("textarea").val());

        $("#" + liveId).html(text);
        $("#" + codeId).html("<pre class=\"prettyprint linenums well well-small\">" + escapeHTML(text) + "</pre>");
    });

    prettyPrint();
    
    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
    
});