export function validateStringWithoutNumber(string){
  const re = /\d+/g
  return !re.test(string)
}
