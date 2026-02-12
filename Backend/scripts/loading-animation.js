function loadingAnimation(
  text = '',
  chars = ['⠙', '⠘', '⠰', '⠴', '⠤', '⠦', '⠆', '⠃', '⠋', '⠉'],
  delay = 100,
) {
  let x = 0

  return setInterval(function () {
    process.stdout.write('\r' + chars[x++] + ' ' + text)
    x = x % chars.length
  }, delay)
}

function finishLoadingAnimation(interval) {
  clearInterval(interval)
  process.stdout.clearLine()
  process.stdout.write('\r' + 'Loading complete!\n')
}

function finishLoaderAnimationWithError(interval, errorMessage) {
  clearInterval(interval)
  process.stdout.clearLine()
  process.stdout.write('\r' + errorMessage + '\n')
}

module.exports = {
  loadingAnimation,
  finishLoadingAnimation,
  finishLoaderAnimationWithError,
}

module.exports = {
  loadingAnimation,
  finishLoadingAnimation,
  finishLoaderAnimationWithError,
}
