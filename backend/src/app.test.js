const bll = require("./controller/bll");

//probar insercion de usuarios
test("update password", async () => {
  const usuario = { contraseña: "testing" };
  const req = { params: { id: "5ee8247fe56f43646ce6974a" }, body: { usuario } };
  const res = { status: 0 };
  const data = await bll.UpdateUserPassword(req, null, null);
  console.log(data);
});
