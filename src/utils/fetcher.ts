export default async function fetcher(path?: string) {
  try {
    const response = await fetch(`${process.env.API_URL}${path}`, {
      headers: {
        'X-Master-Key': '$2a$10$7erJ79kLckGHgck0DPyF6OutuPISB1syGRRgxt708zPyiQtA4.BI.'
      }
    })
    const result = await response.json()

    return result?.record
  } catch (err) {
    console.error(err)
  }
}
