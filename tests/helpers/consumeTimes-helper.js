export default async function consumeTimes(algorithm, key, times) {
    if (!Number.isInteger(times) || times < 1) {
        throw new Error("times deve ser um inteiro positivo.");
    }

    let result;

    for (let x = 0; x < times; x++) {
        result = await algorithm.consume(key);
        
    }

    return result;
}