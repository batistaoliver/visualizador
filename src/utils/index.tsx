import { Points, Vector3 } from 'three'

//const API_URL = process.env.API_URL || 'http://localhost:8880'
const API_URL = process.env.API_URL || 'http://152.228.129.55:8880'
export const apiURL = (append: string = '') => {
  return `${trimChar(API_URL, '/')}/${trimChar(append, '/')}`
}

export const trimChar = (str: string, char: string) =>
  str.replace(new RegExp(char, 'g'), ' ').trim().replace(/\s/g, char)

export const getMeshCenterPoint = (mesh: Points): Vector3 => {
  const center = new Vector3()
  const geometry = mesh.geometry
  geometry.computeBoundingBox()
  geometry.boundingBox.getCenter(center)
  mesh.localToWorld(center)

  return center
}