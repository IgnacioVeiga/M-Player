function uint8ArrayToBase64(uint8Array) {
    const binary = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
    return Buffer.from(binary, 'binary').toString('base64');
}

module.exports = { uint8ArrayToBase64 };