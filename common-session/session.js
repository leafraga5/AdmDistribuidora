function forbiddenErrorHandler (url, message, forbiddenAlert = true){
    if (forbiddenAlert) {
        alert(message);
    }
    location.href = url;
};