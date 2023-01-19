from mycroft_bus_client import MessageBusClient, Message
import json
client = MessageBusClient()

with open("./memoria/stateLobules.json", "r") as json_file:
    # Carga el contenido del archivo en un diccionario de Python
    data = json.load(json_file)

# Modifica el valor del chatbot
data["mycroftOut"] = 1

# Abre el archivo para escritura
with open("./memoria/stateLobules.json", "w") as json_file:
    # Serializa el diccionario de nuevo en formato JSON y escribe en el archivo
    json.dump(data, json_file)

def print_utterance(message):
    data = message.data.get('utterance')
    print('Mycroft said "{}"'.format(message.data.get('utterance')))
    data_json = json.dumps({"response": data})
    with open("./memoria/mycroft.json", "w") as outfile:
        outfile.write(data_json)

print('Registering handler for speak message...')
client.on('speak', print_utterance)

client.run_forever()