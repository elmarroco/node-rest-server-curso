// ================================
// Puerto
//=================================

process.env.PORT = process.env.PORT || 3000;

// ================================
// Entrorno
//=================================

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// ================================
// Vencimiento del token
//=================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ================================
// Seed
//=================================

process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";

// ================================
// Base de datos
//=================================
const urlDB = process.env.MONGO_URI || "mongodb://localhost:21018/cafe";

process.env.URLDB = urlDB;

// ================================
// Google client id
//=================================
process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "215062113832-kvhncbkg7ooe0fe208e4q99rf43inctm.apps.googleusercontent.com";
