//#region Modelos
const Examen = require("../models/models").Examen;
const Prueba = require("../models/models").Prueba;
const GrupoSanguineo = require("../models/models").GrupoSanguineo;
var mongoose = require("mongoose");
//#endregion

//#region Servicios
const PatientServices = require("./paciente");
const PregnancyServices = require("./embarazo");
const BloodGroupServices = require("./pruebas/gruposanguineo");
//#endregion

//#region Examen
exports.GetTests = async (query, page, limit) => {
  try {
    var tests = await Examen.find(query)
      .populate({ path: "paciente", populate: { path: "examenes" } })
      .populate({ path: "embarazo", populate: { path: "examenes" } })
      .populate("pruebas");
    return tests;
  } catch (err) {
    throw Error("GetTests -> Obteniendo Examenes.");
  }
};
exports.GetTest = async (id) => {
  try {
    var test = await Examen.findById(id)
      .populate({ path: "paciente", populate: { path: "examenes" } })
      .populate({ path: "embarazo", populate: { path: "examenes" } })
      .populate("pruebas");
    return test;
  } catch (err) {
    throw Error("GetTest -> Obteniendo Examen con id: " + id);
  }
};
exports.InsertTest = async (body) => {
  try {
    var { fecha, observaciones, embarazo, paciente, pruebas, tipo, activo } = body;
    const test = new Examen({
      fecha,
      observaciones,
      embarazo,
      paciente,
      pruebas,
      tipo,
      activo,
    });
    const saved = await test.save();
    if (tipo === "Paciente") {
      //se adiciona el examen en el paciente
      await PatientServices.InsertTestToPatient(saved);
    } else {
      //se adiciona el examen en el embarazo
      await PregnancyServices.InsertTestToPregnancy(saved);
    }
    return saved;
  } catch (err) {
    throw Error("InsertTest -> Insertando Examen \n" + err);
  }
};
exports.UpdateTest = async (id, body) => {
  try {
    var { fecha, observaciones, embarazo, paciente, pruebas, tipo, activo } = body;
    const test = { fecha, observaciones, embarazo, paciente, pruebas, tipo, activo };
    const updated = await Examen.findByIdAndUpdate(id, test);
    return updated;
  } catch (err) {
    throw Error("UpdateTest -> Modificando Examen \n" + err);
  }
};
exports.DeleteTest = async (test) => {
  try {
    if (test.tipo === "Paciente") {
      //se eliminea el examen en el paciente
      await PatientServices.DeleteTestInPatient(test);
    } else {
      //eliminar el examen del embarazo
      await PregnancyServices.DeleteTestInPregnancy(test);
    }
    //eliminar tambien todas las pruebas
    test.pruebas.forEach(async (prueba) => {
      if (prueba.tipo === "Grupo Sanguineo") {
        //eliminar Grupo Sanguineo con id
        await GrupoSanguineo.findByIdAndRemove(prueba._id);
      } else if (prueba.tipo === "Identificación Anticuerpo") {
        //eliminar Identificación Anticuerpo con id
        await GrupoSanguineo.findByIdAndRemove(prueba._id);
      } else if (prueba.tipo === "Pesquizaje Anticuerpo") {
        //eliminar Pesquizaje Anticuerpo con id
        await GrupoSanguineo.findByIdAndRemove(prueba._id);
      }
      //eliminar prueba con id
      await Prueba.findByIdAndRemove(prueba._id);
    });
    //eliminar examen con id
    const removed = await Examen.findByIdAndRemove(test._id);
    return removed;
  } catch (err) {
    throw Error("DeleteTest -> Eliminando Examen \n" + err);
  }
};
exports.DeleteTests = async (tests) => {
  try {
    await tests.forEach(async (test) => {
      exports.DeleteTest(test);
    });
  } catch (err) {
    throw Error("DeleteTests -> Eliminando Examenes \n" + err);
  }
};
exports.DisableTest = async (id, test) => {
  try {
    if (test.activo) {
      test.activo = false;
      //desactivar todas las pruebas del examen
      await test.pruebas.forEach(async (prueba) => {
        prueba.activo = false;
        //modifico el activo de la prueba
        await Prueba.findByIdAndUpdate(prueba._id, prueba);
      });
      //modificar el examen
      var updated = await Examen.findByIdAndUpdate(id, test);
      return updated;
    } else {
      return await exports.DeleteTest(test);
    }
  } catch (err) {
    throw Error("DisableTest -> Desactivando Examen \n" + err);
  }
};
exports.DisableTests = async (tests) => {
  try {
    //desactivar todas las pruebas
    await tests.forEach(async (test) => {
      //desactivar todas las pruebas
      await exports.DisableTest(test._id, test);
    });
  } catch (err) {
    throw Error("DisableTests -> Desactivando Examen \n" + err);
  }
};
//insertar la prueba en el examen que pertenece
exports.InsertPruebaToTest = async (prueba) => {
  try {
    const examen = await Examen.findById(prueba.examen);
    if (prueba.estado === "Nueva") {
      await examen.pruebas.push(prueba);
      const saved = await examen.save();
      return saved;
    }
  } catch (err) {
    throw Error("InsertDetailTestToTest -> Insertando Prueba en Examen \n" + err);
  }
};
//eliminar una prueba perteneciente al examen
exports.DeletePruebaInTest = async (prueba) => {
  try {
    const examen = await this.GetTest(prueba.examen);

    clonpruebas = [...examen.pruebas];
    //buscar el indice del elemento que representa esa prueba en el arreglo de pruebas del examen
    let index = clonpruebas.indexOf(prueba._id);
    if (index) {
      //eliminar del arreglo el elemento
      clonpruebas.splice(index, 1);
      //hacer un update del examen
      const examen = { pruebas: clonpruebas };
      var updated = await Examen.findByIdAndUpdate(examen._id, updated);
    }
    return updated;
  } catch (err) {
    throw Error("DeleteDetailTestInTest -> Eliminando Prueba en Examen \n" + err);
  }
};
exports.InsertNewDetailsInTest = async (pruebas, examen) => {
  try {
    pruebas.forEach((prueba) => {
      prueba = { examen: examen };
      if (prueba.estado === "Nueva") {
        if (prueba.tipo === "Grupo Sanguineo") BloodGroupServices.InsertBloodGroup(prueba);
      }
    });
  } catch (err) {
    throw Error("InsertDetailsInTest -> Insertando Pruebas Nuevas en Examen \n" + err);
  }
};
//#endregion
