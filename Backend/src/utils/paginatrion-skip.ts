export function calcSkip(page?: number, take?: number) {
  const p = page && page > 0 ? page : 1
  const t = take && take > 0 ? take : 10
  return (p - 1) * t
}
