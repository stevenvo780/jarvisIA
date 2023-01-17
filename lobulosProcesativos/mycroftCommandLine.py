from mycroft_bus_client import MessageBusClient, Message

client = MessageBusClient()
client.run_in_thread()

while True:
    print("Escribe tu pregunta (escribe 'salir' para terminar): ")
    prompt = input()
    if prompt.lower() == "salir":
        break
    client.emit(Message('recognizer_loop:utterance',
                        {"utterances": [prompt]}))
