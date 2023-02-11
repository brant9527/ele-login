<template>
  <div class="hello">
    <input v-model="searchContent" @keydown.enter="search" />
    <button @click="search(searchContent)">Search</button>
  </div>
</template>

<script>
const puppeteer = require('puppeteer-core')
// const electron = require('electron')
// const puppeteer = require('puppeteer-core')
// const { spawn } = require('child_process')
export default {
  name: 'HelloWorld',
  data () {
    return {
      searchContent: ''
    }
  },
  methods: {
    async search (context) {
      const browser = await puppeteer.launch({
        defaultViewport: {
          width: 850,
          height: 800
        },
        headless: false,
        args: ['--start-fullscreen', '--no-sandbox', '--disable-blink-features=AutomationControlled'],

        // 除受控提示
        ignoreDefaultArgs: ['--enable-automation'],
        // executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
        executablePath:
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      })

      const page = await browser.newPage()
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'plugins', {
          get: () => [1, 2, 3, 4]
        })
      })
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
      )
      await page.evaluate(() => {
        Object.defineProperties(navigator, { webdriver: { get: () => false } })
      })
      await page.evaluate(() => {
        window.navigator.chrome = { runtime: {} }
      })
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'languages', {
          get: () => ['en-US', 'en']
        })
      })

      await page.evaluate(() => {
        Object.defineProperty(navigator, 'plugins', {
          get: () => [1, 2, 3]
        })
      })
      await page.goto(
        'https://login.aliexpress.com/seller.htm?return_url=http%3A%2F%2Fgsp.aliexpress.com%2F',
        {
          waitUntil: 'networkidle2'
        }
      )

      console.log('等待中')
      // const frame = await page.$('iframe')

      let frame = await page.frames().find((f) => f.name() === '')
      console.log('等待中frame', frame)

      const childframe2 = (await frame.childFrames())[0]
      await childframe2.waitForSelector('#fm-login-submit', { timeout: 0 })
      await childframe2.waitFor(3000)

      await childframe2.click('#fm-login-id') //
      await childframe2.type('#fm-login-id', 'fossafrong@163.com', {
        delay: Math.random() * 10
      })
      await childframe2.click('#fm-login-password') // '百度一下'按钮的id. 注释3
      await childframe2.type('#fm-login-password', 'w921533w', {
        delay: Math.random() * 10
      })
      await childframe2.waitFor(1000)
      await childframe2.click('#fm-login-submit') // 点击登录按钮

      await childframe2.waitFor(3000)
      frame = await childframe2.childFrames()
      console.log('frame=>', frame)
      const slideFrame = frame[0]
      if (slideFrame) {
        const slidebtn = await slideFrame.$('.btn_slide')
        console.log('slidebtn=>', slidebtn.boundingBox())
        const { x, y } = await slidebtn.boundingBox()
        console.log(x, y)
        slidebtn.boundingBox()
        // const btnPosition = await this.getBtnPosition(slideFrame)
        const spanInfo = await slidebtn.boundingBox()
        slidebtn.focus()
        await page.mouse.move(spanInfo.x + 21, spanInfo.y + 11)
        await page.waitFor(1000)
        await page.mouse.down()
        await page.mouse.move(spanInfo.x + 271, spanInfo.y + 11, {
          steps: 20
        })

        await page.mouse.up()
      }
      await childframe2.click('#fm-login-submit') // 点击登录按钮

      await page.waitForSelector('.arise-menu-link')
    }
  }
}
</script>
