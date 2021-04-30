// eslint-disable-next-line import/prefer-default-export
export const logError = (req, res) => {
  const { meta, text, stack } = req.body
  process.stderr.write(`\n${meta} =>\n${text}\n\nStack trace:${stack}\n\n`)
  return res.status(200)
}
