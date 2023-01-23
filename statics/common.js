//generates random id;
const int32SignedToUnsigned = (int32) => Uint32Array.from(Int32Array.of(int32))[0];
const int32UnsignedToSigned = (uint32) => Int32Array.from(Uint32Array.of(uint32))[0];

function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}
let id = (input) => {
    var hash = 0, len = input.length;
    for (var i = 0; i < len; i++) {
        hash  = ((hash << 5) - hash) + input.charCodeAt(i);
        hash |= 0; // to 32bit integer
    }
    return ('h'+utf8_to_b64(hash)).replaceAll('=');
}