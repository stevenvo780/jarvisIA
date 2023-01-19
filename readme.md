# Proyecto Jarvis en Español

El sueño de muchos amantes a los comics y películas, este proyecto busca darle vida a Jarvis, el asistente virtual de Tony Stark, en este caso en español, con el fin de que podamos tener un asistente virtual en español, que nos ayude en nuestras tareas diarias, y que nos ayude a mejorar nuestro conocimiento en el área de la inteligencia artificial.
Esta funciona a traves de aprendizaje automático, procesamiento de lenguaje natural y ejecución de comandos del sistema operativo.

El proyecto busca aprovechar el poder de los avances en IA para lograr la Jarvis mas realista posible.
el proyecto está diseñado para ser totalmente personalizable, permitiendo a los usuarios modificar y adaptar Jarvis a sus necesidades individuales. Por ejemplo, se pueden agregar comandos personalizados y scripts para automatizar tareas específicas, y se pueden cambiar las respuestas predeterminadas de Jarvis para adaptarlas a la personalidad y preferencias del usuario.

Esta funciona atravesé de pesos emocionales dentro de las interacción con el usuario para discernir que debe hacer de que no, aunque sepa muchas cosas que esta se adecué a la personalidad del usuario, estro a traves de la confianza que generan los modelos en sus respuestas mas el aprendizaje automático de los sentimientos que trasmite el usuario a traves de texto.

Para resolver a los comando y conversaciones usa distintos módulos pre entrenados como para traducciones, y conversaciones de tipo chat, luego tiene otros 3 modelos que se entrenan continuamente, que es Razon, Body y Discernimiento, estos 3 modelos son los que se encargan de darle vida a Jarvis, y de darle la personalidad que tiene, ya que estos modelos son los que se encargan de darle la respuesta a las preguntas que se le hacen, y de darle la personalidad que tiene.

Fuera de los modelos se apoya de Mycroft otra asistente virtual OpenSorce muy amada en la comunidad, este es un modulo que se puede desactivar, ya que se puede usar solo con los modelos, pero se recomienda usarlo ya que es muy bueno y tiene muchas cosas que se pueden aprovechar.

También cuenta con Betty para comandos del sistema con lenguaje natural y conexión con wolframalpha para resolver problemas matemáticos y problemas varios.

Al contar con una conexión directamente con la terminal puedes adjuntar cualquier script a un nuevo comando para jarvis, y si ingresas un comando directo lo va a detectar y ejecutar directamente contando como una terminal, aunque esta funcionalidad aun necesita mejoras.

Por ahora es muy torpe y de va a preguntar sobre lo que no sepa o no tenga mucha seguridad de lo que dice, pero con el tiempo se ira mejorando.

En resumen, el proyecto busca crear una versión en español del asistente virtual Jarvis, utilizando técnicas de aprendizaje automático y procesamiento de lenguaje natural. El objetivo es lograr un asistente virtual lo más realista posible, que pueda ayudar al usuario en sus tareas diarias y mejorar su conocimiento en el área de la IA. El sistema cuenta con varios módulos, como Mycroft, Betty, y WolframAlpha, y también tiene un sistema de inteligencia emocional para detectar y responder a las emociones del usuario. Aunque todavía necesita mejoras, el proyecto tiene el potencial de convertirse en una herramienta útil y valiosa para los usuarios.

Además, el proyecto esta diseñado para ser escalable y seguir mejorando, ya que cuenta con un sistema de actualizaciones automáticas, y un sistema de retroalimentación de los usuarios, con el cual el equipo de desarrollo puede detectar problemas y errores y corregirlos, así como agregar nuevas funcionalidades y mejoras.

# Requisitos
Node.js
dotenv
Python
Mycroft
Betty
readline
Archivo .env que contiene las variables de entorno necesarias para el correcto funcionamiento del script
# Uso
Asegúrese de tener una versión reciente de Node.js instalada en su computadora.
También requiere de multiples librerías que encontraras en los python, luego mejorare este aspecto de instalación.
Descargue o clone el repositorio y navegue hasta la carpeta del script.
Ejecute el comando npm install para instalar las dependencias necesarias.
Asegúrese de que el archivo .env está en la carpeta raíz y contiene las variables de entorno necesarias.
Ejecute el script con el comando node index.js.
Una vez inicializado, el script le pedirá una pregunta. Escriba su pregunta y presione enter para obtener una respuesta.
El script continuará ejecutándose y esperando una nueva pregunta hasta que se cierre manualmente.
# Características
Aprendizaje automático para mejorar las respuestas del sistema con el tiempo.
Procesamiento de lenguaje natural para comprender preguntas en lenguaje natural.
Ejecución de comandos del sistema operativo a través de la interfaz de línea de comando.
# Notas
El script está en un periodo de aprendizaje, por lo que las respuestas pueden no ser precisas o relevantes en todos los casos.
El script puede ejecutar comandos del sistema operativo, por lo que debe ser utilizado con precaución y solo por usuarios experimentados.

# Documentación:

El proyecto esta inspirado en el cerebro humano, teniendo en la corteza las acciones que controlan el OS, luego tenemos la Gestion de memoria donde esta todo el modulo de aprendizaje
luego tenemos los lobulos procesativos que son multiples modelos de lenguaje NLP de trasformers y un sistema para leer mycroft, luego tenemos la memoria en si, donde se guarda todo el conocimiento
Luego tenemos NLP que son los módulos para leer los NLP de la memoria de forma rápida, ya por ultimo tenemos a Jarvis y su EGO, Jarvis es el inciador del sistema y el Ego el controlador de las respuestas como ocurre en los sistemas humanos.