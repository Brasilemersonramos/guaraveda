document.addEventListener("DOMContentLoaded", () => {
    const formContato = document.getElementById("form-contato");
    const inputTelefone = document.getElementById("telefone");

    // Máscara Dinâmica para o Telefone ((XX) XXXXX-XXXX ou (XX) XXXX-XXXX)
    if (inputTelefone) {
        inputTelefone.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "");

            if (value.length > 11) value = value.slice(0, 11);

            if (value.length > 10) {
                // Formato celular: (XX) 9XXXX-XXXX
                value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
            } else if (value.length > 5) {
                // Formato fixo parcial: (XX) XXXX-XXXX
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
            }

            e.target.value = value;
        });
    }

    // Validação e Envio do Formulário
    if (formContato) {
        formContato.addEventListener("submit", (e) => {
            e.preventDefault();

            const nome = document.getElementById("nome").value.trim();
            const telefone = inputTelefone.value.trim();
            const email = document.getElementById("email").value.trim();

            // Validação simples dos campos obrigatórios
            if (!nome || !telefone || !email) {
                alert("Por favor, preencha todos os campos obrigatórios (*).");
                return;
            }

            // Validação básica de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Por favor, insira um e-mail válido.");
                return;
            }

            // Envio do Formulário via AJAX / PHP
            if (formContato) {
                formContato.addEventListener("submit", async (e) => {
                    e.preventDefault();

                    const btnEnviar = formContato.querySelector(".btn-enviar");
                    const textoOriginalBtn = btnEnviar.innerHTML;

                    // Desabilita o botão enquanto envia
                    btnEnviar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ENVIANDO...';
                    btnEnviar.disabled = true;

                    const formData = new FormData(formContato);

                    try {
                        const response = await fetch("php/enviar.php", {
                            method: "POST",
                            body: formData
                        });

                        const resultado = await response.json();

                        if (resultado.status === "success") {
                            alert(resultado.message);
                            formContato.reset();
                        } else {
                            alert(resultado.message);
                        }
                    } catch (error) {
                        alert("Ocorreu um erro ao tentar enviar o formulário. Verifique sua conexão ou a hospedagem.");
                    } finally {
                        btnEnviar.innerHTML = textoOriginalBtn;
                        btnEnviar.disabled = false;
                    }
                });
            }
        });
    }
    
});