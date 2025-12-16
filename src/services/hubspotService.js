import HubSpot from '@hubspot/api-client'

const hubspotClient = new HubSpot.Client({
    accessToken: process.env.HUBSPOT_PRIVATE_APP_TOKEN
})
console.log(hubspotClient)


class HubspotService {
    async createContact(data) {
        try {
            const contactObj = {
                properties: {
                    firstname: data.nombre,
                    email: data.email,
                    phone: data.telefono,
                    subject: data.asignatura
                }
            };

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