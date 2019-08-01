const express = require("express");

let {
  verificaToken,
  verificaAdminRole
} = require("../middlewares/autenticacion");

let app = express();

let Categoria = require("../models/categoria");

// ==============================
// Mostrar todas las categorias
// ==============================

app.get("/categoria", verificaToken, (req, res) => {
  let desde = Number(req.query.desde || 0);
  let limite = Number(req.query.limite || 5);

  Categoria.find({})
    .sort('descripcion')
    .populate("usuario", "nombre email")
    .skip(desde)
    .limit(limite)
    .exec((err, categorias) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      Categoria.count((err, conteo) => {
        res.json({
          ok: true,
          categorias,
          cuantos: conteo
        });
      });
    });
});

// ==============================
// Mostrar una categoría por ID
// ==============================
app.get("/categoria/:id", verificaToken, (req, res) => {
  const id = req.params.id;
  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "No se encontro la categoría"
        }
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

// ==============================
// Crear nueva categoría
// ==============================
app.post("/categoria", verificaToken, (req, res) => {
  let body = req.body;
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  });
  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "No se pudo crear la categoría"
        }
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

// ==============================
// Actualizar categoría
// ==============================
app.put("/categoria/:id", verificaToken, (req, res) => {
  const id = req.params.id;
  const body = req.body;
  Categoria.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "No se encontro la categoría"
          }
        });
      }
      return res.json({
        ok: true,
        categoria: categoriaDB
      });
    }
  );
});

// ==============================
// Eliminar categoría
// ==============================
app.delete("/categoria/:id", [verificaToken, verificaAdminRole], (req, res) => {
  // Regresa nueva categoría
  const id = req.params.id;

  Categoria.findByIdAndDelete(id, (err, categoriaBorrada) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    if (!categoriaBorrada) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Categoría no encontrada"
        }
      });
    }
    res.json({
      ok: true,
      message: "Categoría borrada con exito"
    });
  });
});

module.exports = app;
