declare class DOMException {
    code: number
    name: string
}

// adapted from: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Feature-detecting_localStorage
const storageAvailable = (type: string): boolean => {
    let storage

    try {
        storage = window[type as keyof Window]
        const x = '__storage_test__'
        storage.setItem(x, x)
        storage.removeItem(x)
        return true
    } catch (e) {
        return (
            e instanceof DOMException && // everything except Firefox
            (e.code === 22 || // Firefox
                e.code === 1014 || // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' || // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && // acknowledge QuotaExceededError only if there's something already stored
            !!storage &&
            storage.length !== 0
        )
    }
}

export const isLocalStorageAvailable = (): boolean => storageAvailable('localStorage')
export const isSessionStorageAvailable = (): boolean => storageAvailable('sessionStorage')
export const clearStorage = (): void => {
    if (isLocalStorageAvailable()) {
        localStorage.clear()
    }

    if (isSessionStorageAvailable()) {
        sessionStorage.clear()
    }
}
