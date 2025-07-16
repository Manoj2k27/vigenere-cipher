
function formatText(text) {
  return text.toUpperCase().replace(/[^A-Z]/g, '');
}

function parseFileContent(fileContent) {
  const lines = fileContent.trim().split(/\r?\n/);
  let text = "";
  let key = "";

  lines.forEach(line => {
    if (line.toUpperCase().startsWith("PLAINTEXT:")) {
      text = line.split(":")[1].trim();
    } else if (line.toUpperCase().startsWith("CIPHERTEXT:")) {
      text = line.split(":")[1].trim();
    } else if (line.toUpperCase().startsWith("KEY:")) {
      key = line.split(":")[1].trim();
    }
  });

  return { text, key };
}

function encrypt() {
  let plaintext = document.getElementById("inputText").value;
  let key = document.getElementById("key").value;

  if (!plaintext || !key) {
    alert("Please enter both plaintext and key.");
    return;
  }

  plaintext = formatText(plaintext);
  key = formatText(key);

  let ciphertext = "";
  for (let i = 0, j = 0; i < plaintext.length; i++) {
    const p = plaintext.charCodeAt(i) - 65;
    const k = key.charCodeAt(j % key.length) - 65;
    const c = (p + k) % 26;
    ciphertext += String.fromCharCode(c + 65);
    j++;
  }

  document.getElementById("result").innerText = ciphertext;
}

function decrypt() {
  let ciphertext = document.getElementById("inputText").value;
  let key = document.getElementById("key").value;

  if (!ciphertext || !key) {
    alert("Please enter both ciphertext and key.");
    return;
  }

  ciphertext = formatText(ciphertext);
  key = formatText(key);

  let plaintext = "";
  for (let i = 0, j = 0; i < ciphertext.length; i++) {
    const c = ciphertext.charCodeAt(i) - 65;
    const k = key.charCodeAt(j % key.length) - 65;
    const p = (c - k + 26) % 26;
    plaintext += String.fromCharCode(p + 65);
    j++;
  }

  document.getElementById("result").innerText = plaintext;
}

function encryptFromFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  if (!file) {
    alert("Please upload a .txt file containing PLAINTEXT and KEY.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const { text, key } = parseFileContent(e.target.result);
    if (!text || !key) {
      alert("File must contain both PLAINTEXT and KEY.");
      return;
    }

    const plaintext = formatText(text);
    const formattedKey = formatText(key);
    let ciphertext = "";

    for (let i = 0, j = 0; i < plaintext.length; i++) {
      const p = plaintext.charCodeAt(i) - 65;
      const k = formattedKey.charCodeAt(j % formattedKey.length) - 65;
      const c = (p + k) % 26;
      ciphertext += String.fromCharCode(c + 65);
      j++;
    }

    document.getElementById("result").innerText = ciphertext;
  };

  reader.readAsText(file);
}

function decryptFromFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  if (!file) {
    alert("Please upload a .txt file containing CIPHERTEXT and KEY.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const { text, key } = parseFileContent(e.target.result);
    if (!text || !key) {
      alert("File must contain both CIPHERTEXT and KEY.");
      return;
    }

    const ciphertext = formatText(text);
    const formattedKey = formatText(key);
    let plaintext = "";

    for (let i = 0, j = 0; i < ciphertext.length; i++) {
      const c = ciphertext.charCodeAt(i) - 65;
      const k = formattedKey.charCodeAt(j % formattedKey.length) - 65;
      const p = (c - k + 26) % 26;
      plaintext += String.fromCharCode(p + 65);
      j++;
    }

    document.getElementById("result").innerText = plaintext;
  };

  reader.readAsText(file);
}

function downloadResult() {
  const result = document.getElementById("result").innerText;
  if (!result.trim()) {
    alert("Nothing to download. Please encrypt or decrypt first.");
    return;
  }

  const blob = new Blob([result], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "vigenere_result.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function toggleMode() {
  const mode = document.querySelector('input[name="mode"]:checked').value;

  if (mode === "manual") {
    document.getElementById("manualInputSection").style.display = "block";
    document.getElementById("fileInputSection").style.display = "none";
  } else {
    document.getElementById("manualInputSection").style.display = "none";
    document.getElementById("fileInputSection").style.display = "block";
  }
}
