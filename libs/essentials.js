define(['essentials'], function() {

    return {
        isLessThenIE7: function () {
            return (document.documentElement.getAttribute("class").indexOf("lt-ie7") >= 0);
        },
        isLessThenIE8: function () {
            return (document.documentElement.getAttribute("class").indexOf("lt-ie8") >= 0);
        },
        isLessThenIE9: function () {
            return (document.documentElement.getAttribute("class").indexOf("lt-ie9") >= 0);
        },
        isLessThenIE10: function () {
            return (document.documentElement.getAttribute("class").indexOf("lt-ie10") >= 0);
        },
        isIE: function () { // see http://msdn.microsoft.com/en-us/library/ie/bg182625(v=vs.85) and http://msdn.microsoft.com/en-us/library/ie/ms537503(v=vs.85)
            var ua = window.navigator.userAgent;
            return (ua.indexOf("MSIE") >=0 || ua.indexOf("Trident") >=0);
        },
        isIE9CompatView: function () {
            var ua = window.navigator.userAgent;
            return (ua.indexOf("Mozilla/4.0") >= 0 && ua.indexOf("MSIE 7.0") >= 0 && ua.indexOf("Trident/5.0") >= 0);
        }
    }
});
