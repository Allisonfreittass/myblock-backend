// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Contrato de Aluguel Inteligente
 * @author Seu Nome Aqui
 * @notice Gerencia o ciclo de vida de contratos de aluguel, incluindo criação,
 * pagamento com multas, finalização e consulta eficiente de dados.
 * Utiliza ReentrancyGuard da OpenZeppelin para maior segurança.
 */
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Rent is ReentrancyGuard {
    // Enum para controlar o estado do contrato de forma clara e segura.
    enum Status { Ativo, Atrasado, Finalizado }

    // Struct aprimorada com todos os campos necessários para gerenciar o aluguel.
    struct Contrato {
        uint id;
        address locador;
        address locatario;
        uint256 valorAluguel; // Valor em Wei
        string imovel;
        uint256 createdAt;
        Status status;
        uint256 proximoVencimento;
        uint256 multaPorAtraso; // Valor da multa em Wei
        uint256 ultimaAtualizacao;
    }

    // Variáveis de estado
    uint public totalContratos;
    mapping(uint => Contrato) public contratos;

    // Mapeamentos para indexar e buscar contratos de forma eficiente,
    // evitando a necessidade de loops no frontend.
    mapping(address => uint[]) private contratosDoLocador;
    mapping(address => uint[]) private contratosDoLocatario;

    // --- Eventos detalhados para monitoramento off-chain ---
    event ContratoCriado(
        uint indexed id,
        address indexed locador,
        address indexed locatario,
        uint256 valorAluguel,
        uint256 proximoVencimento
    );

    event PagamentoRecebido(
        uint indexed id,
        address indexed devedor,
        uint256 valorPago,
        uint256 novoVencimento
    );

    event ContratoFinalizado(uint indexed id);

    /**
     * @notice Cria um novo contrato de aluguel.
     * @param _locatario Endereço da carteira do locatário.
     * @param _valorAluguel Valor mensal do aluguel em Wei.
     * @param _imovel Descrição do imóvel.
     */
    function createContract(address _locatario, uint256 _valorAluguel, string memory _imovel) public {
        require(_valorAluguel > 0, "O valor do aluguel deve ser maior que zero.");
        require(_locatario != address(0), "Endereco do locatario invalido.");
        require(_locatario != msg.sender, "Locador e locatario nao podem ser o mesmo.");

        totalContratos++;
        uint id = totalContratos;
        
        uint256 primeiroVencimento = block.timestamp + 30 days;
        uint256 multa = _valorAluguel / 10; // Lógica de multa: 10% do valor do aluguel

        contratos[id] = Contrato({
            id: id,
            locador: msg.sender,
            locatario: _locatario,
            valorAluguel: _valorAluguel,
            imovel: _imovel,
            createdAt: block.timestamp,
            status: Status.Ativo,
            proximoVencimento: primeiroVencimento,
            multaPorAtraso: multa,
            ultimaAtualizacao: block.timestamp
        });

        // Adiciona o ID do contrato aos índices para busca rápida
        contratosDoLocador[msg.sender].push(id);
        contratosDoLocatario[_locatario].push(id);

        emit ContratoCriado(id, msg.sender, _locatario, _valorAluguel, primeiroVencimento);
    }

    /**
     * @notice Permite que o locatário pague o aluguel. A função é 'payable'.
     * @dev Usa o modifier 'nonReentrant' para prevenir ataques de reentrância.
     * @param _id O ID do contrato a ser pago.
     */
    function pagarAluguel(uint _id) public payable nonReentrant {
        Contrato storage contrato = contratos[_id];

        // --- CHECAGENS (Checks) ---
        require(contrato.id != 0, "Contrato nao encontrado.");
        require(msg.sender == contrato.locatario, "Apenas o locatario pode pagar.");
        require(contrato.status != Status.Finalizado, "Este contrato foi finalizado.");

        uint256 valorDevido = contrato.valorAluguel;

        // Verifica se está atrasado e adiciona a multa ao valor devido
        if (block.timestamp > contrato.proximoVencimento) {
            contrato.status = Status.Atrasado;
            valorDevido += contrato.multaPorAtraso;
        }
        require(msg.value >= valorDevido, "Valor enviado e insuficiente para quitar a parcela.");

        // --- EFEITOS (Effects) ---
        // Atualiza o estado do contrato ANTES de enviar o Ether (padrão Checks-Effects-Interactions)
        contrato.proximoVencimento += 30 days;
        contrato.ultimaAtualizacao = block.timestamp;
        contrato.status = Status.Ativo; // Contrato volta ao status Ativo após pagamento

        emit PagamentoRecebido(_id, msg.sender, msg.value, contrato.proximoVencimento);

        // --- INTERAÇÕES (Interactions) ---
        // Efetua a transferência para o locador
        (bool success, ) = contrato.locador.call{value: msg.value}("");
        require(success, "Transferencia de fundos para o locador falhou.");
    }

    /**
     * @notice Permite que o locador finalize um contrato ativo.
     * @param _id O ID do contrato a ser finalizado.
     */
    function finalizarContrato(uint _id) public {
        Contrato storage contrato = contratos[_id];
        require(contrato.id != 0, "Contrato nao encontrado.");
        require(msg.sender == contrato.locador, "Apenas o locador pode finalizar o contrato.");
        
        contrato.status = Status.Finalizado;
        emit ContratoFinalizado(_id);
    }

    // --- FUNÇÕES DE LEITURA (View) ---

    /**
     * @notice Retorna todos os detalhes de um contrato específico.
     */
    function getContract(uint _id) public view returns (Contrato memory) {
        return contratos[_id];
    }

    /**
     * @notice Retorna os IDs de todos os contratos de um determinado locador.
     */
    function getContratosPorLocador(address _locador) public view returns (uint[] memory) {
        return contratosDoLocador[_locador];
    }

    /**
     * @notice Retorna os IDs de todos os contratos de um determinado locatário.
     */
    function getContratosPorLocatario(address _locatario) public view returns (uint[] memory) {
        return contratosDoLocatario[_locatario];
    }
}