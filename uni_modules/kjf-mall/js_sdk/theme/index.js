import doLog from '../doLog'

const theme = {
  mainBg: '#f9e6be'
}

theme.set = (newTheme) => {
  switch (newTheme) {
    case 'yellowTheme': {
      theme.mainBg = '#f9e6be'
      break
    }
    default: {
      theme.mainBg = '#f9e6be'
      break
    }
  }

  // #ifdef H5
  try {
    const eleReadPage = document.querySelector('.pages-book-read')
    if (eleReadPage) {
      eleReadPage.style.backgroundColor = theme.mainBg
    }
  } catch (e) {
    doLog.error(e)
  }
  // #endif
}
export default theme
