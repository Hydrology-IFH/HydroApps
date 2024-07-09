export function getReasonableDigits(min, max) {
  let dif = Math.abs(max - min);
  if (dif>=10){
    return 0
  } else if (dif < 10 && dif > 1){
    return 1
  } else if (dif <= 1 && dif > 0.1){
    return 2
  } else if (dif <= 0.1){
    return 3
  }
}