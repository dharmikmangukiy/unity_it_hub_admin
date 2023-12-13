import CryptoJS from "crypto-js";

// let encrypted;

const Convert_PassWord = (props) => {
  const password = "gK6dE3Wn1S8rY9Qc";
  const message = props.message;

  const CryptoJSAesJson = {
    stringify: function (cipherParams) {
      const vbJsonString = {
        ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64),
      };
      if (cipherParams.iv) {
        vbJsonString["iv"] = cipherParams.iv.toString();
      }
      if (cipherParams.salt) {
        vbJsonString["s"] = cipherParams.salt.toString();
      }
      return JSON.stringify(vbJsonString);
    },
    parse: function (jsonStr) {
      const vbJsonParse = JSON.parse(jsonStr);
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(vbJsonParse.ct),
      });
      if (vbJsonParse.iv) {
        cipherParams["iv"] = CryptoJS.enc.Hex.parse(vbJsonParse.iv);
      }
      if (vbJsonParse["s"]) {
        cipherParams.salt = CryptoJS.enc.Hex.parse(vbJsonParse.s);
      }
      return cipherParams;
    },
  };

 const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(message),
    password,
    { format: CryptoJSAesJson }
  ).toString();


  const decrypted = JSON.parse(
    CryptoJS.AES.decrypt(encrypted, password, {
      format: CryptoJSAesJson,
    }).toString(CryptoJS.enc.Utf8)
  );

  // const decryptedFromPHP = JSON.parse(
  //   CryptoJS.AES.decrypt(
  //     '{"ct":"gasRpWQpHmKZqIqgHvq4RSjLAsy5kA7VHrUbf6dQJYE=","iv":"e2af6922450774f8607e07069d7a6c26","s":"8d06584d95ded803"}',
  //     password,
  //     { format: CryptoJSAesJson }
  //   ).toString(CryptoJS.enc.Utf8)
  // );
  
  return btoa(encrypted);
};

export { Convert_PassWord };