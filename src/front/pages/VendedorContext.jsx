procesarOrden: async (itemId, direccion, coordenadas) => {
  try {
    const token = localStorage.getItem("vendedor_token");
    const response = await fetch(`${process.env.BACKEND_URL}/api/vendedor/itemcarrito/${itemId}/direccion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        direccion,
        lat: coordenadas.lat,
        lon: coordenadas.lon,
      }),
    });

    if (!response.ok) throw new Error("Error al procesar la orden");

    return true;
  } catch (error) {
    console.error("❌ Error en procesarOrden:", error);
    return false;
  }
}