// Lógica para exibir/ocultar campos dependendo do tipo de usuário
document.getElementById("tipoUsuario").addEventListener("change", function() {
    const tipoUsuario = this.value;

    const adotanteCampos = document.getElementById("adotanteCampos");
    const ongCampos = document.getElementById("ongCampos");

    if (tipoUsuario === "adotante") {
        adotanteCampos.classList.remove("hidden");
        ongCampos.classList.add("hidden");
    } else if (tipoUsuario === "ong") {
        adotanteCampos.classList.add("hidden");
        ongCampos.classList.remove("hidden");
    }
});

// Lógica para o envio do formulário
document.getElementById("cadastroForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    // Obtém os dados do formulário
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const senha = document.getElementById("senha").value;
    const tipoUsuario = document.getElementById("tipoUsuario").value;

    // Adiciona os dados de endereço dependendo do tipo de usuário
    let dadosAdotante = {};
    let dadosOng = {};

    if (tipoUsuario === 'adotante') {
        dadosAdotante = {
            endereco: {
                rua: document.getElementById("rua").value,
                numero: document.getElementById("numero").value,
                cidade: document.getElementById("cidade").value,
                estado: document.getElementById("estado").value
            }
        };
    } else if (tipoUsuario === 'ong') {
        dadosOng = {
            nome_ong: document.getElementById("nome_ong").value,
            cnpj: document.getElementById("cnpj").value,
            endereco: {
                rua: document.getElementById("rua_ong").value,
                numero: document.getElementById("numero_ong").value,
                cidade: document.getElementById("cidade_ong").value,
                estado: document.getElementById("estado_ong").value
            },
            telefone_ong: document.getElementById("telefone_ong").value
        };
    }

    // Preparando os dados para enviar
    const dadosDoFormulario = {
        nome: nome,
        email: email,
        telefone: telefone,
        senha: senha,
        tipo_usuario: [tipoUsuario],  // Ex: ["adotante"] ou ["ong"]
        ...(tipoUsuario === 'adotante' ? { adotante_info: dadosAdotante } : {}),
        ...(tipoUsuario === 'ong' ? { ong_info: dadosOng } : {})
    };

    // Envia os dados para a API
    fetch('/api/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosDoFormulario)
    })
    .then(response => {
        if (response.ok) {
            alert('Usuário cadastrado com sucesso!');
            // Opcional: Redirecionar para uma página de login ou outra página
            window.location.href = '/login.html'; // Altere conforme necessário
        } else {
            alert('Erro ao cadastrar. Tente novamente.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro na conexão com o servidor.');
    });
});
