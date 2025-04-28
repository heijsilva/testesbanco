document.getElementById('loadPetsBtn').addEventListener('click', () => {
    fetch('http://localhost:3333/api/pets')
        .then(response => response.json())
        .then(data => {
            const petsContainer = document.getElementById('petsContainer');
            petsContainer.innerHTML = '';  // Limpa o container antes de exibir novos pets

            data.forEach(pet => {
                // Criar o card do pet
                const petCard = document.createElement('div');
                petCard.classList.add('petCard');

                // Adiciona imagem do pet
                const petImage = document.createElement('img');
                petImage.src = pet.foto_url;
                petImage.alt = pet.nome;
                petImage.classList.add('petImage');

                // Informações do pet (nome, tipo, idade, porte)
                const petInfo = document.createElement('div');
                petInfo.classList.add('petInfo');
                petInfo.innerHTML = `
                    <strong>${pet.nome}</strong><br>
                    Tipo: ${pet.tipo}<br>
                    Idade: ${pet.idade} anos<br>
                    Porte: ${pet.porte}
                `;

                // Descrição do pet
                const petDescription = document.createElement('div');
                petDescription.classList.add('petDescription');
                petDescription.innerHTML = `${pet.descricao}`;

                // Raça, castrado e vacinado
                const petStatus = document.createElement('div');
                petStatus.classList.add('petStatus');
                petStatus.innerHTML = `
                    <div><span class="statusLabel">Raça:</span> ${pet.raca.nome}</div>
                    <div><span class="statusLabel">Castrado:</span> ${pet.castrado ? 'Sim' : 'Não'}</div>
                    <div><span class="statusLabel">Vacinado:</span> ${pet.vacinado ? 'Sim' : 'Não'}</div>
                `;

                // Botão para mostrar detalhes da ONG
                const detailsButton = document.createElement('button');
                detailsButton.classList.add('detailsButton');
                detailsButton.innerText = 'Exibir Detalhes da ONG';
                detailsButton.onclick = () => {
                    const details = petCard.querySelector('.petDetails');
                    details.style.display = details.style.display === 'none' || details.style.display === '' ? 'block' : 'none';
                };

                // Detalhes da ONG
                const petDetails = document.createElement('div');
                petDetails.classList.add('petDetails');
                petDetails.innerHTML = `
                    <p><strong>Nome da ONG:</strong> ${pet.id_ong.nome}</p>
                    <p><strong>Endereço:</strong> ${pet.id_ong.ong_info.endereco.rua}, ${pet.id_ong.ong_info.endereco.numero}, ${pet.id_ong.ong_info.endereco.cidade} - ${pet.id_ong.ong_info.endereco.estado}</p>
                    <p><strong>Telefone:</strong> ${pet.id_ong.telefone}</p>
                `;

                // Adicionando os elementos ao card
                petCard.appendChild(petImage);
                petCard.appendChild(petInfo);
                petCard.appendChild(petDescription);
                petCard.appendChild(petStatus);
                petCard.appendChild(detailsButton);
                petCard.appendChild(petDetails);

                // Adiciona o card ao container de pets
                petsContainer.appendChild(petCard);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os pets:', error);
            alert('Erro ao carregar os pets. Tente novamente mais tarde.');
        });
});
