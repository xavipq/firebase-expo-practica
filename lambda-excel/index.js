const ExcelJS = require('exceljs');

exports.handler = async (event) => {
  console.log("EVENT COMPLETO:", JSON.stringify(event, null, 2));

  try {
    // FORZAR que event.body sea string
    let rawBody = event.body || "[]";
    if (typeof rawBody !== "string") {
      rawBody = JSON.stringify(rawBody);
    }

    const empleados = JSON.parse(rawBody);

    if (!Array.isArray(empleados) || empleados.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No hay datos para exportar" }),
      };
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Empleados");

    sheet.columns = [
      { header: "Nombre", key: "nombre", width: 20 },
      { header: "Apellido", key: "apellido", width: 20 },
      { header: "Salario", key: "salario", width: 15 },
    ];

    empleados.forEach(emp => {
      sheet.addRow({
        nombre: emp.nombre || "Sin nombre",
        apellido: emp.apellido || "Sin apellido",
        salario: emp.salario || 0,
      });
    });

    // Estilo
    sheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    const base64 = buffer.toString("base64");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="empleados.xlsx"',
      },
      body: base64,
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error("ERROR EN LAMBDA:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error interno",
        error: error.message,
        receivedBody: event.body,
      }),
    };
  }
};