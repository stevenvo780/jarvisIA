from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import tensorflow as tf
import os
import json
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.ERROR)
# from transformers import GPT2Tokenizer


tokenizer = AutoTokenizer.from_pretrained("PlanTL-GOB-ES/gpt2-large-bne")

model = AutoModelForCausalLM.from_pretrained("PlanTL-GOB-ES/gpt2-large-bne")

# Configura el modelo en modo evaluación
model.eval()
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
    with open("./memoria/BigNLP.json", "w") as outfile:
        outfile.write(data_json)