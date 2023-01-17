from mycroft_bus_client import MessageBusClient, Message
import json
client = MessageBusClient()

def print_utterance(message):
    data = message.data.get('utterance')
    print('Mycroft said "{}"'.format(message.data.get('utterance')))
    data_json = json.dumps({"response": data})
    with open("./memoria/mycroft.json", "w") as outfile:
        outfile.write(data_json)


print('Registering handler for speak message...')
client.on('speak', print_utterance)

client.run_forever()