const path = require('path')


const uploadFile = (req, res) => {

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(404).send("No hay archivos para carga.")
    return
  }

  if (!req.files.archivo) {
    res.status(404).send("No hay archivo para subir.");
    return;
  }

  console.log("req.files >>>", req.files); // eslint-disable-line

  const { archivo } = req.files;

  const uploadPath =  path.join(__dirname, '../uploads', archivo.name);

  archivo.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send({ 
        message: 'File uploaded to ' + uploadPath 
    })

  });
};

module.exports = { uploadFile };
