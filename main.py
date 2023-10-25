from flask import Flask, render_template, jsonify, request
import base64
from io import BytesIO
from PIL import Image
import cv2
import numpy as np


def get_position_boxes(image):
    positions = []

    yolov4_net = cv2.dnn.readNet("yolov4/yolov4-custom.cfg",
                                 "yolov4/yolov4-custom_best.weights")

    blob = cv2.dnn.blobFromImage(np.array(image), 1 / 255.0, (416, 416), swapRB=True, crop=False)

    class_names = ["box_text"]

    with open("yolov4/obj.names", "r") as f:
        classes = f.read().strip().split("\n")

    yolov4_net.setInput(blob)
    layer_names = yolov4_net.getUnconnectedOutLayersNames()
    outs = yolov4_net.forward(layer_names)

    confidence_threshold = 0.5

    boxes = []
    confidences = []
    class_ids = []

    for out in outs:
        for detection in out:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]

            if confidence > confidence_threshold:
                # Coordenadas da caixa delimitadora
                center_x = int(detection[0] * image.width)
                center_y = int(detection[1] * image.height)
                width = int(detection[2] * image.width)
                height = int(detection[3] * image.height)

                # Coordenadas da caixa delimitadora superior esquerda
                x = int(center_x - width / 2)
                y = int(center_y - height / 2)

                # Adicione a caixa delimitadora, confiança e classe às listas
                boxes.append([x, y, width, height])
                confidences.append(float(confidence))
                class_ids.append(class_id)

    indexes = cv2.dnn.NMSBoxes(boxes, confidences, confidence_threshold, 0.4)

    for i in range(len(boxes)):
        if i in indexes:
            x, y, width, height = boxes[i]
            positions.append([x, y, width, height])

    return positions


app = Flask(__name__)


@app.route('/')
def pagina():
    return render_template('index.html')


@app.route('/get_positions_box', methods=['POST'])
def get_positions_box():
    dados = request.json
    valor = dados['image']

    data = valor.split(',')[1]

    # Decodifique os dados em bytes
    image_bytes = base64.b64decode(data)

    # Crie um objeto de imagem a partir dos bytes
    image = Image.open(BytesIO(image_bytes))

    if image.mode != 'RGB':
        image = image.convert('RGB')

    positions = get_position_boxes(image)

    return jsonify({'positions': positions})


if __name__ == '__main__':
    app.run(debug=True)
