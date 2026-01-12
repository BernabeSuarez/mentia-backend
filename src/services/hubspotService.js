import HubSpot from '@hubspot/api-client'

const hubspotClient = new HubSpot.Client({
    accessToken: process.env.HUBSPOT_PRIVATE_APP_TOKEN
})



class HubspotService {
    async createContact(data) {
        try {
            const contactObj = {
                properties: {
                    firstname: data.nombre,
                    email: data.email,
                    phone: data.telefono
                }
            };

            // Agregar asignatura si está presente
            if (data.asignatura) {
                contactObj.properties.subject = data.asignatura;
            }

            // Agregar mensaje si está presente
            if (data.mensaje) {
                contactObj.properties.message = data.mensaje;
            }

            const response = await hubspotClient.crm.contacts.basicApi.create(contactObj);

            return {
                success: true,
                data: response.body,
                message: 'Contacto creado en Hubspot correctamente'
            };
        } catch (error) {
            console.error("Error al crear contacto:", error);
            return {
                success: false,
                message: 'Error al crear contacto',
                error: error.message
            };
        }
    }
}

export default new HubspotService();