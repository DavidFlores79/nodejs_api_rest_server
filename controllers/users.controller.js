

getData = (req, res) => {

    // const queryParams = req.query
    const { q, nombre = 'nadie', page, apiKey } = req.query

    res.send({
        message: 'Todos los usuarios por GET',
        q,
        nombre,
        page,
        apiKey
    });
}

postData = (req, res) => {
    res.status(201).send({
       message: 'Se ha creado el registro por POST',
    });
}

updateData = (req, res) => {
    const { id } = req.params
    res.send({
       message: `Se ha actualizado el registro ${id}`,
    });
}

deleteData = (req, res) => {
    
    const { id } = req.params
    res.send({
       message: `Se ha eliminado el registro ${id}`,
    });
}

module.exports = { getData, postData, updateData, deleteData }