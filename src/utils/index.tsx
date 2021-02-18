const API_URL = process.env.API_URL || 'http://localhost:8880'

export const apiURL = (append: string = '') => {
  return `${trimChar(API_URL, '/')}/${trimChar(append, '/')}`
}

export const trimChar = (str: string, char: string) =>
  str.replace(new RegExp(char, 'g'), ' ').trim().replace(/\s/g, char)
