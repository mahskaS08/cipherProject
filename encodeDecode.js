
  
  

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
// scripts.js


app.get("/cipher", function (req, res) {  //http://localhost:4000/cipher
  res.sendFile(__dirname + "/index.html");
});
app.get("/ceaser.html", function (req, res) {  //http://localhost:4000/cipher
  res.sendFile(__dirname + "/ceaser.html");
});

app.get("/block.html", function (req, res) {  //http://localhost:4000/cipher
  res.sendFile(__dirname + "/block.html");
});

app.get("/streamKey.html", function (req, res) {  //http://localhost:4000/cipher
  res.sendFile(__dirname + "/streamKey.html");
});



app.post("/ceaserEncode", function (req, res) {
  const normalText = req.body.normalText;
  const key = req.body.key1;
  const encryptedText = ceaserEncrypt(normalText, key);
  res.send("Encrypted text: " + encryptedText);
});

app.post("/blockEncode", function (req, res) {
  const normalText = req.body.normalText;
  const key = req.body.key1;
  const encryptedText = blockEncrypt(normalText, key);
  res.send("Encrypted text: " + encryptedText);
});

app.post("/streamEncode", function (req, res) {
  const normalText = req.body.normalText;
  const key = req.body.key1;
  const encryptedText = streamEncrypt(normalText, key);
  res.send("Encrypted text: " + encryptedText);
});



app.listen(4000, function () {
  console.log("Server started on port 4000");
});


app.post("/ceaserDecode", function (req, res) {
    const encrpytedText = req.body.encodedText;
    const key = req.body.key2;
    const decryptedText = ceaserDecrypt(encrpytedText, key);
    res.send("Decrypted text: " + decryptedText);
  });

app.post("/blockDecode", function (req, res) {
    const encrpytedText = req.body.encodedText;
    const key = req.body.key2;
    const decryptedText = blockDecrypt(encrpytedText, key);
    res.send("Decrypted text: " + decryptedText);
  });

app.post("/streamDecode", function (req, res) {
    const encrpytedText = req.body.encodedText;
    const key = req.body.key2;
    const decryptedText = streamDecrpyt(encrpytedText, key);
    res.send("Decrypted text: " + decryptedText);
  });
  

function ceaserEncrypt(message, key) {
    // Convert the key to a valid range (0-25)
    key = ((key % 26) + 26) % 26;
  
    let result = "";
  
    for (let i = 0; i < message.length; i++) {
      let char = message[i];
  
      if (char.match(/[a-z]/i)) {
        let code = message.charCodeAt(i);
  
        if (code >= 65 && code <= 90) {
          char = String.fromCharCode(((code - 65 + key) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          char = String.fromCharCode(((code - 97 + key) % 26) + 97);
        }
      }
  
      result += char;
    }
  
  
    
    return result;
  }
  

  function streamEncrypt(word, key) {
    let encryptedWord = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
    word = word.toUpperCase();
    key = key.toUpperCase();
  
    const wordLen = word.length;
    const keyLen = key.length;
  
    for (let i = 0; i < wordLen; i++) {
      if (word[i] >= 'A' && word[i] <= 'Z') {
        const row = key[i % keyLen].charCodeAt(0) - 'A'.charCodeAt(0);
        const col = word[i].charCodeAt(0) - 'A'.charCodeAt(0);
        const encryptedChar = alphabet[(row + col) % 26];
        encryptedWord += encryptedChar;
      } else {
        encryptedWord += word[i];
      }
    }
  
    return encryptedWord.toLowerCase();
  }

  function blockEncrypt(message, key) {
    let encrypted = '';
    const length = message.length;
    const numCols = Math.ceil(length / key);
  
    if (length % key !== 0) {
      const numPadding = key - (length % key);
      message += 'x'.repeat(numPadding);
    }
  
    message = message.split('').reverse().join('');
  
    for (let i = 0; i < key; i++) {
      for (let j = 0; j < numCols; j++) {
        const index = j * key + i;
        if (index < length) {
          encrypted += message[index];
        }
      }
    }
  
    return encrypted;
  }
  
  
function ceaserDecrypt(message, key) {
    // Convert the key to a valid range (0-25)
    key = ((key % 26) + 26) % 26;
  
    let result = "";
  
    for (let i = 0; i < message.length; i++) {
      let char = message[i];
  
      if (char.match(/[a-z]/i)) {
        let code = message.charCodeAt(i);
  
        if (code >= 65 && code <= 90) {
          char = String.fromCharCode(((code - 65 - key) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          char = String.fromCharCode(((code - 97 - key) % 26) + 97);
        }
      }
  
      result += char;
    }
  
  
    
    return result;
  }

  function streamDecrpyt(word, key) {
    let decryptedWord = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
    word = word.toLowerCase();
    key = key.toUpperCase();
  
    const wordLen = word.length;
    const keyLen = key.length;
  
    for (let i = 0; i < wordLen; i++) {
      if (word[i] >= 'a' && word[i] <= 'z') {
        const row = key[i % keyLen].charCodeAt(0) - 'A'.charCodeAt(0);
        const col = word[i].charCodeAt(0) - 'a'.charCodeAt(0);
        const decryptedChar = alphabet[(col - row + 26) % 26];
        decryptedWord += decryptedChar;
      } else {
        decryptedWord += word[i];
      }
    }
  
    return decryptedWord;
  }
  

  function blockDecrypt(message, key) {
    const numCols = Math.floor(message.length / key);
    let decrypted = '';
  
    for (let j = 0; j < key; j++) {
      for (let i = 0; i < numCols; i++) {
        const index = i * key + j;
        decrypted += message[index];
      }
    }
  
    decrypted = decrypted.split('').reverse().join('');
    while (decrypted.endsWith('x')) {
      decrypted = decrypted.slice(0, -1);
    }
  
    return decrypted;
  }