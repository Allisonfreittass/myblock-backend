// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Contrato de Aluguel Inteligente (com pausa e cancelamento)
 */
contract Rent is ReentrancyGuard, Ownable {
    enum Status { Ativo, Atrasado, Finalizado, Cancelado }

    struct Contrato {
        uint id;
        address locador;
        address locatario;
        uint256 valorAluguel;
        string imovel;
        uint256 createdAt;
        Status status;
        uint256 proximoVencimento;
        uint256 multaPorAtraso;
        uint256 ultimaAtualizacao;
    }

    uint public totalContratos;
    mapping(uint => Contrato) public contratos;
    mapping(address => uint[]) private contratosDoLocador;
    mapping(address => uint[]) private contratosDoLocatario;

    bool public paused = false;

    modifier somenteAtivo() {
        require(!paused, "Sistema pausado pelo administrador.");
        _;
    }

    // --- Eventos ---
    event ContratoCriado(uint indexed id, address indexed locador, address indexed locatario, uint256 valorAluguel, uint256 proximoVencimento);
    event PagamentoRecebido(uint indexed id, address indexed devedor, uint256 valorPago, uint256 novoVencimento);
    event ContratoFinalizado(uint indexed id);
    event ContratoCancelado(uint indexed id, address canceladoPor);
    event SistemaPausado(bool estado);

    constructor() Ownable(msg.sender) {}

    function pausarSistema(bool _estado) public onlyOwner {
        paused = _estado;
        emit SistemaPausado(_estado);
    }

    function createContract(address _locatario, uint256 _valorAluguel, string memory _imovel) public somenteAtivo {
        require(_valorAluguel > 0, "O valor do aluguel deve ser maior que zero.");
        require(_locatario != address(0), "Endereco do locatario invalido.");
        require(_locatario != msg.sender, "Locador e locatario nao podem ser o mesmo.");

        totalContratos++;
        uint id = totalContratos;
        uint256 primeiroVencimento = block.timestamp + 30 days;
        uint256 multa = _valorAluguel / 10;

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

        contratosDoLocador[msg.sender].push(id);
        contratosDoLocatario[_locatario].push(id);

        emit ContratoCriado(id, msg.sender, _locatario, _valorAluguel, primeiroVencimento);
    }

    function pagarAluguel(uint _id) public payable nonReentrant somenteAtivo {
        Contrato storage contrato = contratos[_id];
        require(contrato.id != 0, "Contrato nao encontrado.");
        require(msg.sender == contrato.locatario, "Apenas o locatario pode pagar.");
        require(contrato.status == Status.Ativo || contrato.status == Status.Atrasado, "Contrato inativo.");

        uint256 valorDevido = contrato.valorAluguel;
        if (block.timestamp > contrato.proximoVencimento) {
            contrato.status = Status.Atrasado;
            valorDevido += contrato.multaPorAtraso;
        }
        require(msg.value >= valorDevido, "Valor enviado insuficiente.");

        contrato.proximoVencimento += 30 days;
        contrato.ultimaAtualizacao = block.timestamp;
        contrato.status = Status.Ativo;

        emit PagamentoRecebido(_id, msg.sender, msg.value, contrato.proximoVencimento);

        (bool success, ) = contrato.locador.call{value: msg.value}("");
        require(success, "Falha ao transferir fundos.");
    }

    function finalizarContrato(uint _id) public somenteAtivo {
        Contrato storage contrato = contratos[_id];
        require(contrato.id != 0, "Contrato nao encontrado.");
        require(msg.sender == contrato.locador, "Apenas o locador pode finalizar.");

        contrato.status = Status.Finalizado;
        emit ContratoFinalizado(_id);
    }

    function cancelarContrato(uint _id) public somenteAtivo {
        Contrato storage contrato = contratos[_id];
        require(contrato.id != 0, "Contrato nao encontrado.");
        require(msg.sender == contrato.locador || msg.sender == contrato.locatario, "Sem permissao.");
        require(contrato.status != Status.Finalizado && contrato.status != Status.Cancelado, "Ja encerrado.");

        contrato.status = Status.Cancelado;
        emit ContratoCancelado(_id, msg.sender);
    }

    // View
    function getContract(uint _id) public view returns (Contrato memory) {
        return contratos[_id];
    }

    function getContratosPorLocador(address _locador) public view returns (uint[] memory) {
        return contratosDoLocador[_locador];
    }

    function getContratosPorLocatario(address _locatario) public view returns (uint[] memory) {
        return contratosDoLocatario[_locatario];
    }
}
