export default function consumeTimes(algorithm, key, times){
    let result
    for(let x = 0; x < times; x++){
        result = algorithm.consume(key);
    }

    return result
}