import face_recognition
import json
import os
import numpy as np

# Caminhos das imagens
IMAGE_BASE = os.path.join("faces", "otavio.jpg")
IMAGE_COMPARE = os.path.join("faces", "stevejobs.jpg")

print('loading...')
sample_img = face_recognition.load_image_file('faces/otavio.jpg')
other_img = face_recognition.load_image_file('faces/stevejobs.jpg')
database_imgs = [
    sample_img,
    sample_img
]
print('done!')
input('Continue? (Press Enter)')

def generate_embeddings(image):
    embs = face_recognition.face_encodings(image)
    return embs

print('generating embeddings...')
database_embs = [generate_embeddings(img)[0] for img in database_imgs]
print('done')
input('Continue? (Press Enter)')


def compare(sample_img_emb, database_img_embs):
    veredicts = []
    for emb in database_img_embs:
        dist = np.linalg.norm(emb - sample_img_emb)
        veredict = dist < 0.6
        veredicts.append((veredict, dist))
    return veredicts

print('comparing...')
results = compare(database_embs[0], database_embs[1:])
print('done')
print(results)

def gerar_embedding(image_path):
    image = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(image)

    if not encodings:
        raise ValueError(f"Nenhum rosto detectado em {image_path}")

    return encodings[0]

# Gera embeddings
embedding_base = gerar_embedding(IMAGE_BASE)
embedding_compare = gerar_embedding(IMAGE_COMPARE)

# Distância euclidiana entre embeddings
distance = np.linalg.norm(embedding_base - embedding_compare)

# Threshold padrão do face_recognition
THRESHOLD = 0.6
is_same_person = distance < THRESHOLD

# Converte distância em porcentagem de similaridade
# (quanto menor a distância, maior a similaridade)
similarity_percentage = max(0, (1 - distance)) * 100

# Salva embedding base (opcional)
with open("otavio_embedding.json", "w") as f:
    json.dump(embedding_base.tolist(), f)

print("🔍 Resultado da comparação")
print(f"Distância: {distance:.4f}")
print(f"Similaridade: {similarity_percentage:.2f}%")

if is_same_person:
    print("✅ Os rostos pertencem à MESMA pessoa.")
else:
    print("❌ Os rostos NÃO pertencem à mesma pessoa.")
