function multiply() {
  let args = [...arguments]
  let number = args[0]
  let digit = args[1]
  let m = 0,
    s1 = number.toString(),
    s2 = digit.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  } catch (e) {}
  let total = (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
  args.splice(0, 2, total)
  return args.length === 1 ? total : this.multiply(...args)
}

export { multiply }
