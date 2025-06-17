let secretTemporario = null;
const emailUsuario = "usuario@example.com"; // mesmo do JSON backend

function gerarQRCode(event) {
  event?.preventDefault();
  fetch("http://localhost:3000/api/2fa/setup", {
    method: "POST",
    headers: {
      "x-user-email": emailUsuario,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("qr").src = data.qrCode;
      secretTemporario = data.secret;
      document.getElementById("qr-container").style.display = "block";
    })
    .catch((err) => alert("Erro ao gerar QR Code: " + err));
}

function confirmarCodigo(event) {
  event?.preventDefault();
  const token = document.getElementById("codigo").value;

  fetch("http://localhost:3000/api/2fa/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-email": emailUsuario,
    },
    body: JSON.stringify({ token, secret: secretTemporario }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        document.getElementById("mensagem").innerText =
          "✅ 2FA ativado com sucesso!";
      } else {
        alert("Código inválido");
      }
    });
}

function validar2FA(event) {
  event?.preventDefault();
  const token = document.getElementById("validar").value;

  fetch("http://localhost:3000/api/2fa/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-email": emailUsuario,
    },
    body: JSON.stringify({ token }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        document.getElementById("mensagem").innerText =
          "✅ Código 2FA validado com sucesso!";
      } else {
        alert("Código inválido");
      }
    });
}
