// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract rent {
    uint public totalContratos;

    struct Contract {
        uint id;
        address locatario;
        address locador;
        uint256 valor;
        string imovel;
        uint256 createdAt;
    }

    mapping(uint => Contract) public Contracts;

    event createdContract(
        uint id,
        address indexed locador,
        address indexed locatario,
        uint256 valor,
        string imovel,
        uint256 createdAt
    );

    function createContract(address _locatario, uint256 _valor, string memory _imovel) public {
        uint id = totalContratos + 1;
        Contracts[id] = Contract({
            id: id,
            locador: msg.sender,
            locatario: _locatario,
            valor: _valor,
            imovel: _imovel,
            createdAt: block.timestamp
        });

        emit createdContract(id, msg.sender, _locatario, _valor, _imovel, block.timestamp);

        totalContratos++;
    }

    function getContract(uint _id) public view returns( Contract memory){
        return Contracts[_id];
    }
}