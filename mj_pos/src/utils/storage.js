export function setStoreItem(key, value) {
    if (window.mjIsClient && window.mjSetCacheData) {
        window.mjSetCacheData(key, JSON.stringify(value));

        console.log("setStoreItem:" + key + " value:" + value);
    } else {
        window.localStorage.setItem(key, JSON.stringify(value));
    }
}

export function getStoreItem(key) {
    if (window.mjIsClient && window.mjGetCacheData) {
        var info = window.mjGetCacheData(key);
        console.log("getStoreItem:" + key + " value:" + info);
        return JSON.parse(info);
    }
    var info = window.localStorage.getItem(key);
    return JSON.parse(info);
}

export function setup() {

    window.mjSetStoreItem = function(key, value) {
        setStoreItem(key, value);
    }

    window.mjGetStoreItem = function (key) {
        return getStoreItem(key);
    }

    window.mjSetLoginInfo = function (loginInfo) {
        return setStoreItem("cache.login.info", loginInfo);
    }

    window.mjGetLoginInfo = function () {
        return getStoreItem("cache.login.info");
    }
}
