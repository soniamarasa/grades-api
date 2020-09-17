import { db } from '../models/index.js';
import { logger } from '../config/logger.js';
import {promises as fs} from 'fs';

const Grades = db.grades;

const populate = async (_, res) => {
  const grades = JSON.parse(await fs.readFile(global.fileName))
  grades.forEach(async ({name, subject, type, value, lastModified}) => {
    let currentGrade = new Grades({
      name,
      subject,
      type,
      value,
      lastModified: new Date(lastModified)
    })

    await currentGrade.save();
  })
  res.send('Dados importados com sucesso');
}


const create = async (req, res) => {
  try {
    const {name, subject, type, value} = req.body;

    if(!name || !subject || !type || !value) {
      throw new Error("Name, subject, type e value são obrigatórios");
    }

    const student = new Grades({
      name,
      subject,
      type,
      value,
      lastModified: new Date()
    })

    await student.save();
    res.send({ message: 'Grade inserido com sucesso' });
    logger.info(`POST /grade - ${JSON.stringify()}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

const findAll = async (req, res) => {
  const name = req.query.name;

  //condicao para o filtro no findAll
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  try {
    const data = await Grades.find(condition);

    res.send(data);
    logger.info(`GET /grade`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data  = await Grades.findOne({_id: id});

    res.send(data);

    logger.info(`GET /grade - ${id}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar o Grade id: ' + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para atualizacao vazio',
    });
  }

  const id = req.params.id;

  try {
    const data = await Grades.findByIdAndUpdate({_id: id}, req.body, {new: true});
    if (!data) {
      res.send('Não encontrada a grade id: ' + id);
    } else {
      res.send(data);
    }

    logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Grades.findOneAndDelete({_id : id})

    if (!data) {
      res.send('Não encontrada a grade id: ' + id);
    } else {
      res.send('Removido com sucesso');
    }

    logger.info(`DELETE /grade - ${id}`);

  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar o Grade id: ' + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (req, res) => {
  try {
    await Grades.deleteMany();
    res.send('Todos os registros foram apagados');
    
    logger.info(`DELETE /grade`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir todos as Grades' });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { populate, create, findAll, findOne, update, remove, removeAll };
