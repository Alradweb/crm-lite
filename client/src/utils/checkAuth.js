export default function checkAuth(cb) {
    let visibilityChange;
    if (typeof document.hidden !== "undefined") {
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        visibilityChange = "webkitvisibilitychange";
    }

    function checkLocalStorage() {
        const lifetime = localStorage.getItem('token-lifetime');
        if (!lifetime) return;
        const now = Date.now();
        if (now >= lifetime) {
            localStorage.removeItem('token-lifetime');
            cb();
        }
    }

    document.addEventListener(visibilityChange, checkLocalStorage, false);
}
