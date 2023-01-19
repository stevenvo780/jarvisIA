from mycroft_bus_client import MessageBusClient, Message
import json

client = MessageBusClient()
client.run_in_thread()
with open("./memoria/stateLobules.json", "r") as json_file:
    # Carga el contenido del archivo en un diccionario de Python
    data = json.load(json_file)

# Modifica el valor del chatbot
data["mycroftIn"] = 1

# Abre el archivo para escritura
with open("./memoria/stateLobules.json", "w") as json_file:
    # Serializa el diccionario de nuevo en formato JSON y escribe en el archivo
    json.dump(data, json_file)
while True:
    print("Escribe tu pregunta (escribe 'salir' para terminar): ")
    prompt = input()
    if prompt.lower() == "salir":
        break
    client.emit(Message('recognizer_loop:utterance',
                        {"utterances": [prompt]}))
