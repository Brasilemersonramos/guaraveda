document.addEventListener("DOMContentLoaded", () => {
    // Seleção dos elementos do DOM
    const inputBusca = document.getElementById("input-busca");
    const btnBusca = document.querySelector(".busca-produto button");
    const selectOrdenacao = document.getElementById("select-ordenacao");
    const containerProdutos = document.querySelector(".lista-produtos");
    const cardsProdutos = Array.from(document.querySelectorAll(".produto-card"));

    // Seleciona os links da sidebar de categorias
    const botoesCategoria = document.querySelectorAll(".sidebar-categorias [data-categoria]");
    const btnLimparFiltros = document.getElementById("btn-limpar-filtros");

    let categoriaAtual = "todas";

    // 1. FUNÇÃO PARA ATUALIZAR A QUANTIDADE DE PRODUTOS POR CATEGORIA NA SIDEBAR
    function atualizarContadoresCategorias() {
        botoesCategoria.forEach(botao => {
            const cat = botao.getAttribute("data-categoria");

            // Conta quantos cards pertencem a essa categoria
            const qtd = cardsProdutos.filter(card => card.getAttribute("data-categoria") === cat).length;

            // Mantém ou cria o span com a quantidade dentro do link
            let spanContador = botao.querySelector(".qtd-categoria");
            if (!spanContador) {
                spanContador = document.createElement("span");
                spanContador.classList.add("qtd-categoria");
                botao.appendChild(spanContador);
            }
            spanContador.textContent = ` (${qtd})`;
        });
    }

    // 2. FUNÇÃO DE FILTRAGEM (Busca + Categoria)
    function aplicarFiltros() {
        const termoBusca = inputBusca ? inputBusca.value.toLowerCase().trim() : "";

        cardsProdutos.forEach(card => {
            const nomeProduto = card.querySelector("h3").textContent.toLowerCase();
            const categoriaProduto = card.getAttribute("data-categoria");

            // Verifica se corresponde à busca por texto
            const bateuBusca = nomeProduto.includes(termoBusca);

            // Verifica se corresponde à categoria selecionada
            const bateuCategoria = (categoriaAtual === "todas" || categoriaProduto === categoriaAtual);

            // Exibe ou oculta o card
            if (bateuBusca && bateuCategoria) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    }

    // 3. FUNÇÃO DE ORDENAÇÃO (A-Z, Z-A, Padrão)
    function ordenarProdutos() {
        if (!selectOrdenacao) return;

        const opcao = selectOrdenacao.value;
        const produtosOrdenados = [...cardsProdutos];

        if (opcao === "az") {
            produtosOrdenados.sort((a, b) => {
                const nomeA = a.querySelector("h3").textContent.trim();
                const nomeB = b.querySelector("h3").textContent.trim();
                return nomeA.localeCompare(nomeB, 'pt-BR');
            });
        } else if (opcao === "za") {
            produtosOrdenados.sort((a, b) => {
                const nomeA = a.querySelector("h3").textContent.trim();
                const nomeB = b.querySelector("h3").textContent.trim();
                return nomeB.localeCompare(nomeA, 'pt-BR');
            });
        }

        // Reinsere os cards ordenados no contêiner mantendo o estado
        produtosOrdenados.forEach(card => containerProdutos.appendChild(card));
    }

    // 4. RESETAR/SAIR DOS FILTROS
    function limparTodosFiltros() {
        if (inputBusca) inputBusca.value = "";
        if (selectOrdenacao) selectOrdenacao.value = "padrao";

        categoriaAtual = "todas";
        botoesCategoria.forEach(b => b.classList.remove("ativo"));

        aplicarFiltros();
        ordenarProdutos();
    }


    // 5. EVENT LISTENERS

    if (inputBusca) {
        inputBusca.addEventListener("input", aplicarFiltros);
    }

    if (btnBusca) {
        btnBusca.addEventListener("click", (e) => {
            e.preventDefault();
            aplicarFiltros();
        });
    }

    if (selectOrdenacao) {
        selectOrdenacao.addEventListener("change", ordenarProdutos);
    }
    if (btnLimparFiltros) {
        btnLimparFiltros.addEventListener("click", limparTodosFiltros);
    }

    botoesCategoria.forEach(botao => {
        botao.addEventListener("click", (e) => {
            e.preventDefault();

            const categoriaSelecionada = botao.getAttribute("data-categoria");

            // Alterna a seleção se clicar na mesma categoria novamente
            if (categoriaAtual === categoriaSelecionada) {
                categoriaAtual = "todas";
                botao.classList.remove("ativo");
            } else {
                categoriaAtual = categoriaSelecionada;
                botoesCategoria.forEach(b => b.classList.remove("ativo"));
                botao.classList.add("ativo");
            }

            aplicarFiltros();
        });
    });

    // Inicialização da contagem ao carregar a página
    atualizarContadoresCategorias();
});