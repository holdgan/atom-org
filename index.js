const bip39 = require('bip39')
const {hdkey} = require('ethereumjs-wallet')
const util = require('ethereumjs-util')
const CryptoJS = require('crypto-js');  

var keyWA = CryptoJS.enc.Utf8.parse(key);
var ivWA = CryptoJS.enc.Utf8.parse(iv);

Createseed()

function Createseed() {
// module.exports = function Createseed() {

    let mnemonic = bip39.generateMnemonic() 
    // let mnemonic_chinese = bip39.generateMnemonic(128,null,bip39.wordlists.chinese_simplified)

    // let mnemonic = require('./conf.json').mnemonic;
    // let mnemonic = ""
    console.log("word：" + mnemonic)

    getSeed = async ()=>{
        let seed = await bip39.mnemonicToSeed(mnemonic)
        // console.log("seed：" + util.bufferToHex(seed))
        return seed
    }
    obtainAccount = async ()=>{
        let seed = await getSeed()
        let hdWallet = await hdkey.fromMasterSeed(seed)

        for (let i = 0; i < 10000; i++) {
            let key = await hdWallet.derivePath("m/44'/60'/0'/0/" + i)
            let address = await util.pubToAddress(key._hdkey._publicKey, true)
            console.log('test',i+1,util.toChecksumAddress('0x'+address.toString('hex')))

        }
    }
    obtainAccount()
}

function Encrypt(word) {
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, keyWA, { iv: ivWA, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
}
function Decrypt(word) {
    var ciphertextWA = CryptoJS.enc.Hex.parse(word);
    var ciphertextCP = { ciphertext: ciphertextWA };
    var decrypted = CryptoJS.AES.decrypt(
        ciphertextCP,
        keyWA, 
        { iv: ivWA }
    );
    return decrypted.toString(CryptoJS.enc.Utf8); // Apple
}

