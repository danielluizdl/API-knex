const knex = require('../conexao');

const listar = async (req, res) => {
    try {
        const usuarios = await knex('usuarios');
        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(400).json(error.message)
    }
};

const obter = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await knex('usuarios').where({ id }).first();

        if (!usuario) {
            return res.status(404).json('Usuario não encontrado');
        }
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(400).json(error.message)
    }
};

const cadastrar = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome) {
        return res.status(404).json('O campo nome é obrigatorio');
    }

    if (!email) {
        return res.status(404).json('O campo email é obrigatorio');
    }

    if (!senha) {
        return res.status(404).json('O campo senha é obrigatorio');
    }

    try {
        const usuario = await knex('usuarios')
            .insert({ nome, email, senha })
            .returning('*')

        if (usuario.length === 0) {
            return res.status(400).json('Não foi possivel cadastrar o usuario');
        }

        return res.status(200).json(usuario[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const atualizar = async (req, res) => {
    const { nome, email, senha } = req.body;
    const { id } = req.params;

    try {
        const usuarioExiste = await knex('usuarios').where({ id }).first();

        if (!usuarioExiste) {
            return res.status(404).json(' Usuario não encontrado ');
        }

        const usuario = await knex('usuarios')
            .update({ nome, email, senha })
            .where({ id })
            .returning('*')

        if (!usuario) {
            return res.status(400).json('Não foi possivel atualizar o usuario');
        }
        return res.status(200).json('Usuario atualizado com Sucesso');

    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const excluir = async (req, res) => {
    const { id } = req.params

    try {
        const usuarioExiste = await knex('usuarios').where({ id }).first();

        if (!usuarioExiste) {
            return res.status(404).json(' Usuario não encontrado ');
        }

        const usuario = await knex('usuarios')
            .del()
            .where({ id })

        if (!usuario) {
            return res.status(400).json('Não foi possivel excluir o usuario');
        }

        return res.status(200).json('Usuario excluido com sucesso')
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    listar,
    obter,
    cadastrar,
    atualizar,
    excluir
}