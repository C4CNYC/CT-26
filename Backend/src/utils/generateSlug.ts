export type GenerateSlugProps = {
  name?: string
}

export function GenerateSlug({ name }: GenerateSlugProps) {
  if (name) return (new Date().getTime() - 1729692100000).toString(36)
  return (new Date().getTime() - 1729692100000).toString(36)
}
