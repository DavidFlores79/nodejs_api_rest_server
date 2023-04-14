const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2;
const { uploadFiles } = require('../helpers/uploads.helper');
const userModel = require('../models/user.model');
const productModel = require('../models/product.model');


// Configuration 
cloudinary.config({
  cloud_name: "dltvxi4tm",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadFile = async (req, res) => {

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res.status(404).send({ errors: [{ msg: 'No hay archivo para carga.' }] })
  }
  console.log("req.files >>>", req.files); // eslint-disable-line
  
  try {
    //   const { nombre, fullPath } = await uploadFiles(req.files, 'documents', ['txt', 'csv']);
      const { nombre, fullPath } = await uploadFiles(req.files, 'files', ['txt', 'csv']);

      res.status(201).send({
        msg: `Archivo Cargado: ${nombre}`,
        data: nombre
      })
         
  } catch (error) {
    console.log(error);
    res.status(500).send({
      errors: [{
          msg: 'Error al cargar el archivo.'
      }]
    })
  }

};

const uploadImage = async (req, res) => {

    const { coleccion, id } = req.params;

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
      return res.status(404).send({ errors: [{ msg: 'No hay archivo para carga.' }] })
    }

    // console.log("req.files >>>", req.files); // eslint-disable-line

    let modelo;
    // console.log('coleccion', coleccion);

    switch (coleccion) {
      case 'users':
        modelo = await userModel.findById(id)
        if(!modelo) {
          return res.status(404).send({ errors: [{ msg: `El usuario con id: ${id} no existe en la BD.` }] })
        }
        break;
        // console.log(user);
      case 'products':
        modelo = await productModel.findById(id)
        if(!modelo) {
          return res.status(404).send({ errors: [{ msg: `El producto con id: ${id} no existe en la BD.` }] })
        }
        // console.log(product);
        break;
      default:
        return res.status(500).send({ errors: [{ msg: `Esta colección no esta permitida para carga de archivos` }] })
    }
    
    try {

        //const { nombre, uploadPath } = await uploadFiles(req.files, 'documents', ['txt', 'csv']);
        const { nombre, uploadPath } = await uploadFiles(req.files, coleccion);

        //una vez cargado el archivo puedo borrar el anterior
        if(modelo.image) {
          const pathImage = path.join(__dirname, '../uploads/', coleccion, modelo.image)
          if(fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage)
          }
        }

        //actualizamos el nombre en BD
        modelo.image = nombre
        modelo.save()
    
        res.status(201).send({
          msg: `Imagen actualizada: ${nombre}`,
          data: modelo
        })
           
    } catch (error) {
      res.status(500).send({
        errors: [{
            msg: 'Error al actualizar el registro.'
        }]
      })
    }

}

const uploadImageCloudinary = async (req, res) => {

    const { coleccion, id } = req.params;

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
      return res.status(404).send({ errors: [{ msg: `No hay archivo para carga.` }] })
    }

    //archivo temporal que se guarda al cargar
    const { tempFilePath } = req.files.archivo;
    console.log('temp', tempFilePath);

    let modelo;

    switch (coleccion) {
      case 'users':
        modelo = await userModel.findById(id)
        if(!modelo) {
          return res.status(404).send({ errors: [{ msg: `El usuario con id: ${id} no existe en la BD.` }] })
        }
        break;
        // console.log(user);
      case 'products':
        modelo = await productModel.findById(id)
        if(!modelo) {
          return res.status(404).send({ errors: [{ msg: `El producto con id: ${id} no existe en la BD.` }] })
        }
        // console.log(product);
        break;
      default:
        return res.status(500).send({ errors: [{ msg: `Esta colección no está permitida para carga de archivos.` }] })
    }
    
    try {

        //una vez cargado el archivo puedo borrar el anterior
        if(modelo.image) {
          const arrayName = modelo.image.split('/')
          const name = arrayName[ arrayName.length - 1 ]
          const [ public_id ] = name.split('.')
          console.log(public_id);
          cloudinary.uploader.destroy( `${coleccion}/${public_id}`)
        }

        // Upload
        const { secure_url, public_id } = await cloudinary.uploader.upload(tempFilePath, {folder: coleccion} )

        //actualizamos el nombre en BD
        modelo.image = secure_url
        modelo.save()
    
        return res.status(201).send({
          msg: `Imagen cargada ó actualizada.`,
          data: secure_url
        })
           
    } catch (error) {
      console.log(error);
      res.status(500).send({
        errors: [{
            msg: 'Error al actualizar el registro.'
        }]
      })
    }

}

const showImage = async (req, res) => {

  const { coleccion, id } = req.params;

    let modelo;
    // console.log('coleccion', coleccion);

    switch (coleccion) {
      case 'users':
        modelo = await userModel.findById(id)
        if(!modelo) {
          return res.status(404).send({ errors: [{ msg: `El usuario con id: ${id} no existe en la BD.` }] })
        }
        break;
        // console.log(user);
      case 'products':
        modelo = await productModel.findById(id)
        if(!modelo) {
          return res.status(404).send({ errors: [{ msg: `El producto con id: ${id} no existe en la BD.` }] })
        }
        // console.log(product);
        break;
      default:
        return res.status(500).send({ errors: [{ msg: `Esta colección no está permitida para carga de archivos.` }] })
    }
    
    try {

        //si la imagen existe en el id solicitado
        if(modelo.image) {
          const pathImage = path.join(__dirname, '../uploads/', coleccion, modelo.image)
          if(fs.existsSync(pathImage)) {
            return res.sendFile( pathImage )
          }
        }

        const noImagePath = path.join(__dirname, '../assets/images/', 'no-image.png')
        return res.sendFile( noImagePath )
           
    } catch (error) {
      console.log(error);
      res.status(500).send({
        errors: [{
            msg: 'Error al mostrar el registro.'
        }]
      })
    }
}

module.exports = { uploadFile, uploadImage, showImage, uploadImageCloudinary };
