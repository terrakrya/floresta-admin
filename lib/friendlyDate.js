export default date => {
  let split = date.substring(0, 10).split("-")
  let tmp = split[2]
  split[2] = split[0]
  split[0] = tmp
  return split.join("/")
}
