
$(function() {

    const css = window.document.styleSheets[0];

    css.insertRule(`
    @keyframes darken {
    0% { background-color: #D3EEFF; }
    100% { background-color: #000000; }
    }`, css.cssRules.length);    

    $("#cell-0").css({
        "animation-name": "darken",
        "animation-duration": "15s",
        "animation-fill-mode": "forwards"
    });

});

