<?php
// Configurações de resposta JSON
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Captura e limpa os dados enviados pelo formulário
    $nome     = filter_var($_POST['nome'], FILTER_SANITIZE_SPECIAL_CHARS);
    $empresa  = filter_var($_POST['empresa'], FILTER_SANITIZE_SPECIAL_CHARS);
    $telefone = filter_var($_POST['telefone'], FILTER_SANITIZE_SPECIAL_CHARS);
    $email    = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $mensagem = filter_var($_POST['mensagem'], FILTER_SANITIZE_SPECIAL_CHARS);

    // Validações básicas no servidor
    if (!$nome || !$telefone || !$email) {
        echo json_encode(['status' => 'error', 'message' => 'Preencha os campos obrigatórios.']);
        exit;
    }

    // E-mail de destino (o e-mail da sua hospedagem)
    $to = "vendas@guaraveda.com.br";
    $subject = "Novo contato pelo site - " . $nome;

    // Monta o corpo da mensagem
    $body  = "Você recebeu uma nova mensagem através do site:\n\n";
    $body .= "Nome: " . $nome . "\n";
    $body .= "Empresa: " . ($empresa ? $empresa : "Não informada") . "\n";
    $body .= "Telefone: " . $telefone . "\n";
    $body .= "E-mail: " . $email . "\n\n";
    $body .= "Mensagem:\n" . $mensagem . "\n";

    // Cabeçalhos do e-mail (evita cair na caixa de spam)
    $headers  = "From: vendas@guaraveda.com.br\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Dispara o e-mail pelo servidor da hospedagem
    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(['status' => 'success', 'message' => 'Mensagem enviada com sucesso!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ocorreu um erro ao enviar. Tente novamente mais tarde.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método de requisição inválido.']);
}
?>