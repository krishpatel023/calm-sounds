export default function createRandom(lengthOf){
    var randomString = ''
    var Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy0123456789'
    for (var i =0 ; i < lengthOf ; i++){
        randomString += Characters.charAt(Math.floor(Math.random() * Characters.length))
    }
    return randomString
}