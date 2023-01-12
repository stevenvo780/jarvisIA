from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import tensorflow as tf
import json
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.ERROR)


tokenizer = AutoTokenizer.from_pretrained(
    "mrm8488/mbart-large-finetuned-opus-es-en-translation")

model = AutoModelForSeq2SeqLM.from_pretrained(
    "mrm8488/mbart-large-finetuned-opus-es-en-translation")

# Configura el modelo en modo evaluación
model.eval()
# Abre el archivo para lectura
with open("./memoria/stateLobules.json", "r") as json_file:
    # Carga el contenido del archivo en un diccionario de Python
    data = json.load(json_file)

# Modifica el valor del chatbot
data["translateTextEs_En"] = 1

# Abre el archivo para escritura
with open("./memoria/stateLobules.json", "w") as json_file:
    # Serializa el diccionario de nuevo en formato JSON y escribe en el archivo
    json.dump(data, json_file)
while True:
    print("Escribe tu pregunta (escribe 'salir' para terminar): ")
    prompt = input()
    if prompt.lower() == "salir":
        break
    inputs = tokenizer.encode(prompt, return_tensors='pt')
    outputs = model.generate(inputs, max_length=500, do_sample=True)
    text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print(text)
    # Convertir el diccionario a un objeto JSON
    data_json = json.dumps({"response": text})
    # Escribir el objeto JSON en un archivo
    with open("./memoria/translateEs_En.json", "w") as outfile:
        outfile.write(data_json)
