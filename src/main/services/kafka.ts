import { Kafka } from 'kafkajs';

const service = {
    getTopics(bootstrap: any) {
        const kafka = new Kafka({
            clientId: 'test-kafka-connection',
            brokers: bootstrap.split(","),
        });
        const admin = kafka.admin();
        return admin.listTopics();
    },
};

export default service;
