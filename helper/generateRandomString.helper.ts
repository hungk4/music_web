export const generateRandomString = (length: number): string => {
  let result: string = "";
  const characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(let i: number = 0; i < length; i++){
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
