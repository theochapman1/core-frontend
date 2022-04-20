const { ethereum } = window

export default function isMetamask(provider) {
    return typeof ethereum !== 'undefined' && provider === ethereum
}
