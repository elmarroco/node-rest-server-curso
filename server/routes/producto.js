const express = require("express");

const { verificaToken } = require("../middlewares/autenticacion");

let app = express();

const Producto = require("../models/producto");
const Categoria = require("../models/categoria");

// ====================
//  Obtener productos
// ====================
app.get("/productos", verificaToken, (req, res) => {
  // Trae todos los productos
  // populate: usuario categoria
  // paginado
  let desde = Number(req.query.desde || 0);
  let limite = Number(req.query.limite || 5);
  Producto.find({ disponible: true })
    .sort("nombre")
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .skip(desde)
    .limit(limite)
    .exec((err, productos) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      Categoria.count((err, conteo) => {
        res.json({
          ok: true,
          productos,
          cuantos: conteo
        });
      });
    });
});

// ====================
//  Obtener producto por ID
// ====================
app.get("/productos/:id", verificaToken, (req, res) => {
  // populate: usuario categoria
  const id = req.params.id;
  Producto.findById(id)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "No se encontro el producto"
          }
        });
      }
      res.json({
        ok: true,
        producto: productoDB
      });
    });
});

// ====================
//  Buscar productos
// ====================
app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
  let termino = req.params.termino;

  let regex = new RegExp(termino, 'i');

  Producto.find({ nombre: regex })
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      res.json({
        ok: true,
        productos
      });
    });
});

// ====================
//  Crear un nuevo producto
// ====================
app.post("/productos", verificaToken, (req, res) => {
  // guardar el usuario
  // guardar una categoria del listado
  let body = req.body;

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id
  });
  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "No se pudo crear el producto"
        }
      });
    }
    res.status(201).json({
      ok: true,
      producto: productoDB
    });
  });
});

// ====================
//  Actualizar un producto por id
// ====================
app.put("/productos/:id", verificaToken, (req, res) => {
  // guardar el usuario
  // guardar una categoria del listado
  let id = req.params.id;
  let body = req.body;

  Producto.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "No se encontro el producto con ese id"
          }
        });
      }
      return res.json({
        ok: true,
        producto: productoDB,
        mensaje: "Producto borrado"
      });
    }
  );
});

// ====================
//  Borrar un producto (cambiar estado de disponible)
// ====================
app.delete("/productos/:id", verificaToken, (req, res) => {
  const id = req.params.id;

  let cambiaEstado = {
    disponible: false
  };

  Producto.findByIdAndUpdate(
    id,
    cambiaEstado,
    { new: true },
    (err, productoBorrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!productoBorrado) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "No se encontro el producto con ese id"
          }
        });
      }
      return res.json({
        ok: true,
        producto: productoBorrado
      });
    }
  );
});

module.exports = app;
