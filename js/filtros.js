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

    // 0. MAPEAMENTO DE ROTAS DA PÁGINA "SAIBA MAIS"
    // Adicione aqui se alguma categoria não seguir o padrão /html/{categoria}_saibamais.html
    const rotasSaibaMais = {
        "acoplamentos": "./html/acoplamentos_saibamais.html",
        "aneis": "./html/aneis_saibamais.html"
    };

    // Função auxiliar para obter a URL correta de uma categoria
    function obterUrlCategoria(categoria) {
        return rotasSaibaMais[categoria] || `./html/${categoria}_saibamais.html`;
    }

    // Exemplo: Atualiza os atributos href reais para navegação nativa
    botoesCategoria.forEach(botao => {
        const cat = botao.getAttribute("data-categoria");
        if (cat !== "todas") {
            botao.setAttribute("href", obterUrlCategoria(cat));
        }
    });

    // 1. FUNÇÃO PARA BUSCAR E CONTAR OS CARDS DE VARIAÇÃO NAS PÁGINAS SAIBA MAIS
    async function atualizarContadoresCategorias() {
        let totalGeralVariacoes = 0;

        for (const botao of botoesCategoria) {
            const cat = botao.getAttribute("data-categoria");

            // Se for o botão "todas", pulamos momentaneamente para calcular o total no final
            if (cat === "todas") continue;

            // Determina a URL do arquivo HTML correspondente à categoria
            const urlPagina = obterUrlCategoria(cat);

            try {
                const response = await fetch(urlPagina);
                if (!response.ok) throw new Error(`Não foi possível carregar ${urlPagina}`);

                const htmlText = await response.text();

                // Converte a string recebida em um documento HTML navegável
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, "text/html");

                // Conta quantos cards com a classe .card-variacao existem dentro do HTML carregado
                const qtd = doc.querySelectorAll(".card-variacao").length;
                totalGeralVariacoes += qtd;

                // Insere/atualiza o contador no botão da sidebar
                atualizarSpanContador(botao, qtd);

            } catch (error) {
                console.warn(`Erro ao obter contagem para categoria "${cat}":`, error);
                atualizarSpanContador(botao, 0);
            }
        }

        // Atualiza o contador da opção "Todas" com a soma de todas as variações
        const botaoTodas = document.querySelector('.sidebar-categorias [data-categoria="todas"]');
        if (botaoTodas) {
            atualizarSpanContador(botaoTodas, totalGeralVariacoes);
        }
    }

    // Função auxiliar para inserir o HTML da contagem dentro do botão
    function atualizarSpanContador(elemento, quantidade) {
        let spanContador = elemento.querySelector(".qtd-categoria");
        if (!spanContador) {
            spanContador = document.createElement("span");
            spanContador.classList.add("qtd-categoria");
            elemento.appendChild(spanContador);
        }
        spanContador.textContent = ` (${quantidade})`;
    }

    // 2. FUNÇÃO DE FILTRAGEM (Busca + Categoria na página atual)
    function aplicarFiltros() {
        const termoBusca = inputBusca ? inputBusca.value.toLowerCase().trim() : "";

        cardsProdutos.forEach(card => {
            const nomeProduto = card.querySelector("h3").textContent.toLowerCase();
            const categoriaProduto = card.getAttribute("data-categoria");

            const bateuBusca = nomeProduto.includes(termoBusca);
            const bateuCategoria = (categoriaAtual === "todas" || categoriaProduto === categoriaAtual);

            if (bateuBusca && bateuCategoria) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    }

    // 3. FUNÇÃO DE ORDENAÇÃO
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
    if (inputBusca) inputBusca.addEventListener("input", aplicarFiltros);
    if (btnBusca) {
        btnBusca.addEventListener("click", (e) => {
            e.preventDefault();
            aplicarFiltros();
        });
    }
    if (selectOrdenacao) selectOrdenacao.addEventListener("change", ordenarProdutos);
    if (btnLimparFiltros) btnLimparFiltros.addEventListener("click", limparTodosFiltros);

    // CLICK NAS CATEGORIAS COM REDIRECIONAMENTO
    botoesCategoria.forEach(botao => {
        botao.addEventListener("click", (e) => {
            e.preventDefault();

            const categoriaSelecionada = botao.getAttribute("data-categoria");

            // Se o usuário clicar em "todas", apenas filtra a lista local
            if (categoriaSelecionada === "todas") {
                categoriaAtual = "todas";
                botoesCategoria.forEach(b => b.classList.remove("ativo"));
                botao.classList.add("ativo");
                aplicarFiltros();
                return;
            }

            // Redireciona para a página Saiba Mais correspondente
            const urlDestino = obterUrlCategoria(categoriaSelecionada);
            window.location.href = urlDestino;
        });
    });

    // Inicialização da contagem assíncrona ao carregar a página
    atualizarContadoresCategorias();
});
