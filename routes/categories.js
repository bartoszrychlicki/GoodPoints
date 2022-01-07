const express = require("express");
const router = express.Router();
const mong = require("mongoose");

//pobierz wszystkie kategorie
router.get("/", (request, respone) => {});
//pobierz pojedyncza kategorie
router.get("/:id", (request, respone) => {});
//dodaj lub aktualizuj kategorie
router.put("/:id", (request, respone) => {});
//usuń kategorie
router.delete("/:id", (request, respone) => {});

module.exports = router;
