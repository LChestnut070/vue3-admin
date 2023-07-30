export const Set_Token = (token: string) => {
  localStorage.setItem('Token', token)
}
export const Get_Token = () => {
  return localStorage.getItem('Token')
}
export const Remove_Token = () => {
  localStorage.removeItem('Token')
}
