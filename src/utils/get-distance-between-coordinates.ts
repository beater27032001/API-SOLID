// Interface que define a estrutura de uma coordenada geográfica
export interface Coordinate {
  latitude: number // Latitude em graus decimais
  longitude: number // Longitude em graus decimais
}

// Função que calcula a distância entre duas coordenadas geográficas
// Utiliza a fórmula de Haversine para calcular distância em linha reta
export function getDistanceBetweenCoordinates(
  from: Coordinate, // Coordenada de origem
  to: Coordinate, // Coordenada de destino
) {
  // Se as coordenadas forem iguais, retorna 0
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0
  }

  // Converte latitude de graus para radianos
  const fromRadian = (Math.PI * from.latitude) / 180
  const toRadian = (Math.PI * to.latitude) / 180

  // Calcula a diferença de longitude e converte para radianos
  const theta = from.longitude - to.longitude
  const radTheta = (Math.PI * theta) / 180

  // Aplica a fórmula de Haversine para calcular a distância
  let dist =
    Math.sin(fromRadian) * Math.sin(toRadian) +
    Math.cos(fromRadian) * Math.cos(toRadian) * Math.cos(radTheta)

  // Garante que o valor não exceda 1 (limite matemático)
  if (dist > 1) {
    dist = 1
  }

  // Calcula o arco cosseno e converte para graus
  dist = Math.acos(dist)
  dist = (dist * 180) / Math.PI
  // Converte para milhas náuticas e depois para quilômetros
  dist = dist * 60 * 1.1515
  dist = dist * 1.609344

  // Retorna a distância em quilômetros
  return dist
}
