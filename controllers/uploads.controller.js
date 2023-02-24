const { uploadFiles } = require('../helpers/uploads.helper');

const uploadFile = async (req, res) => {

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(404).send("No hay archivo para carga.")
    return
  }
  console.log("req.files >>>", req.files); // eslint-disable-line
  
  try {
    //   const { nombre, fullPath } = await uploadFiles(req.files, 'documents', ['txt', 'csv']);
      const { nombre, fullPath } = await uploadFiles(req.files, 'users');
    
      res.status(201).send({
        message: `Archivo guardado: ${nombre}`
      })    
  } catch (error) {
    res.status(400).send({
        message: error
      })
  }

};

module.exports = { uploadFile };
