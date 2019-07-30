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
let urlDB;
const user = "cafeUser";
const password = "Jose123456";

if ((process.env.NODE_ENV = "dev")) {
  urlDB = "mongodb://localhost:21018/cafe";
} else {
  urlDB = `mongodb+srv://admin:${password}@cluster0-tp4og.mongodb.net/test?retryWrites=true&w=majority`;
}


urldBD = encodeURI(urlDB);

process.env.URLDB = urlDB;
