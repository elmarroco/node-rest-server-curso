// ================================
// Puerto
//=================================

process.env.PORT = process.env.PORT || 3000;

// ================================
// Entrorno
//=================================

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// ================================
// Base de datos
//=================================
const urlDB = process.env.MONGO_URI || "mongodb://localhost:21018/cafe";


process.env.URLDB = urlDB;
