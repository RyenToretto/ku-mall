class NovelReader {
  constructor(tempSpliter = '#-#novel_reader_spliter#-#') {
    this.tempSpliter = tempSpliter
  }

  getContents(content) {
    if (!content) {
      return []
    }
    content = this.deal(content, '\r\n')
    content = this.deal(content, '\n')
    return this.splits(content, this.tempSpliter)
  }

  splits(content, spliter) {
    return content
      .split(spliter)
      .map((item) => (item ? item.trim() : ''))
      .filter((item) => !!item)
  }

  deal(content, spliter) {
    return this.splits(content, spliter).join(this.tempSpliter)
  }
}

const novelReader = new NovelReader()
export default novelReader
