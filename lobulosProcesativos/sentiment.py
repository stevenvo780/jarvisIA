from dotenv import load_dotenv
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import tensorflow as tf
import json
import torch
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.ERROR)
load_dotenv()

tokenizer = AutoTokenizer.from_pretrained(
    "nlptown/bert-base-multilingual-uncased-sentiment")

model = AutoModelForSequenceClassification.from_pretrained(
    "nlptown/bert-base-multilingual-uncased-sentiment")

# Configura el modelo en modo evaluación
model.eval()
# Abre el archivo para lectura
with open("./memoria/stateLobules.json", "r") as json_file:
    # Carga el contenido del archivo en un diccionario de Python
    data = json.load(json_file)

# Modifica el valor del chatbot
data["sentiment"] = 1

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
    outputs = model(inputs)[0]
    scores = torch.softmax(outputs, dim=-1)
    text = scores[0]
    print("Negative Score:", text[0])
    print("Neutral Score:", text[1])
    print("Positive Score:", text[2])
    multiplicador = 0
    try:
        multiplicador = int(os.environ["SENTIMANETAL_SENSITIVITY"])
    except (ValueError, TypeError):
        multiplicador = 0

    negative = text[0].item() * multiplicador
    if (negative > 1):
        negative = 1
    elif (negative < -1):
        negative = -1
    neutral = text[1].item() * multiplicador
    if (neutral > 1):
        neutral = 1
    elif (neutral < -1):
        neutral = -1
    positive = text[2].item() * multiplicador
    if (positive > 1):
        positive = 1
    elif (positive < -1):
        positive = -1
    # Convertir el diccionario a un objeto JSON
    score = positive - negative
    # data_json = json.dumps({"negative": text[0].item(), "neutral": text[1].item(), "positive": text[2].item(), "score": score.item()})
    data_json = json.dumps(
        {"negative": negative, "neutral": neutral, "positive": positive, "score": score})
    # Escribir el objeto JSON en un archivo
    with open("./memoria/sentiment.json", "w") as outfile:
        outfile.write(data_json)
