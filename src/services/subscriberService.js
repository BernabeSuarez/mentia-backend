import { Subscriber } from '../models/Subscriber.js';


class SubscriberService {
    async subscribe(name, email) {
        try {
            // Verificar si ya existe
            const existingSubscriber = await Subscriber.findOne({
                where: { email: email.toLowerCase() }
            });

            if (existingSubscriber) {
                if (existingSubscriber.isActive) {
                    throw new Error('Este Email ya se encuentra suscrito');
                } else {
                    // Reactivar suscripción
                    existingSubscriber.isActive = true;
                    existingSubscriber.name = name;
                    await existingSubscriber.save();
                    return existingSubscriber;
                }
            }

            // Crear nuevo suscriptor
            const subscriber = await Subscriber.create({
                name,
                email: email.toLowerCase()
            });

            return subscriber;
        } catch (error) {
            throw error;
        }
    }

    async unsubscribe(email) {
        const subscriber = await Subscriber.findOne({
            where: { email: email.toLowerCase() }
        });

        if (!subscriber) {
            throw new Error('Suscriptor no encontrado');
        }

        subscriber.isActive = false;
        await subscriber.save();

        return subscriber;
    }

    async getAllSubscribers(isActive = true) {
        return await Subscriber.findAll({
            where: { isActive },
            order: [['createdAt', 'DESC']]
        });
    }

    async getSubscriberCount() {
        return await Subscriber.count({
            where: { isActive: true }
        });
    }
}

export default new SubscriberService();