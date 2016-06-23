var captchaCallback = function(resp) {
  
    //console.log("captcha response is: " + resp);
    $.ajax({
       type: "POST",
       url: "/captcha/verify",
       data: { "resp": resp },
       success: function() {
           $("#cell-3").hide();
           $("#cell-4").show();
           $("#cell-5").show();
       },
       error: function() {
           console.log("bad captcha response!");
           grecaptcha.reset();
       }
    });
    
};

var captchaLoadCallback = function() {
    
    grecaptcha.render("captcha-p", {
       "sitekey" : "6Lcu6SITAAAAAEXMACLegSSxjDARMkZC8hJcpAbG",
       "theme" : "light",
       "size" : "compact",
       "callback" : captchaCallback
    });
    
};

$(function() {
   
    $("head").append("<script src='https://www.google.com/recaptcha/api.js?onload=captchaLoadCallback&render=explicit'></script>");
    
});

