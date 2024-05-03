export let apiAddress = 'https://dkv9ssx2-7239.use2.devtunnels.ms'

export function ChangeApiAddress(newAddress){
    console.log(`La Direccion antigua es: ${apiAddress}`)
    apiAddress = newAddress
    console.log(`La nueva direccion es: ${apiAddress}`)
}

export let accessToken

export function setAccessToken(newToken){
    accessToken = newToken
    console.log(accessToken)
}