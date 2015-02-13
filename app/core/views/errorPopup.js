define([
    "./modal"
],
function (ModalView) {    
    return function (res, text, title, modalOptions) {
        
        // Three ways of using this function:
        //
        // errorPopup("error text");
        // errorPopup("error title", "error text");
        // errorPopup(responseObject);
        
        if (typeof res != "object") {
            if (text) {
                title = res;
                text = text;
            } else {
                text = res;
            }
        } else if (!text || text == "error") {
            
            if (res.status != 502) text = res.responseText;
            if (!text) {
                switch (res.status) {
                    case 0:
                        text = "Network error, check your internet connection and try again";
                        break;
                    case 500:
                        text = "The server has encountered an error. The request could not be completed.";
                        break;
                    case 502:
                        text = "Oops! Something went wrong. Please contact your admin or support@backbonedemo.com for help.";
                        break;
                    case 401:
                        text = "Permission denied. Please check your login credentials and try again.";
                        break;
                    default:
                        text = "The operation returned an error. Please try again.";
                        break;
                }

                var requestId = res.getResponseHeader("X-VENA-REQUEST-ID");
                if (requestId) {
                    text += "\n Request ID: " + requestId;
                }
            }
        };
        
        modalOptions = modalOptions || {
            title: title || "Error",
            body: text || "An error occured. Please refresh your page and try again."
        };
        
        return new ModalView(modalOptions);
    };
});
