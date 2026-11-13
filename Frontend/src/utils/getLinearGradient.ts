import { alpha } from '@mui/system'

export const getLinearGradient = (coverColor: string) => {
  const color = coverColor || '#333333'
  const baseColor = alpha(color, 0.6)
  const gradient = `linear-gradient(75deg, ${color} 22% , ${baseColor} 34% , ${baseColor} 58%, ${color} 90%)`

  return gradient
}

export const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
