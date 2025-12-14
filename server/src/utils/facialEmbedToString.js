/*
 * Converte embedding facial (array de floats) para string base64
 * @param {int[]} embedding 
 * @returns String base64
 */
export default function embeddingToString(embedding) {
    const float32 = new Float32Array(embedding);
    const buffer = Buffer.from(float32.buffer);
    const base64Embedding = buffer.toString("base64")
    return base64Embedding;
}