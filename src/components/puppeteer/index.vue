<template>
  <div class="hello">
    <input v-model="searchContent" @keydown.enter="search" class="input" />
    <button @click="search(searchContent)">启动</button>
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
      searchContent:
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      page: {}
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
        args: [
          '--start-fullscreen',
          '--no-sandbox',
          '--disable-blink-features=AutomationControlled'
        ],

        // 除受控提示
        ignoreDefaultArgs: ['--enable-automation'],
        executablePath: context
        // "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      })

      const page = (this.page = await browser.newPage())
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

      await page.waitForSelector('.next-menu-sub-menu-wrapper')
      await this.withdraw(page)
    },
    async withdraw (page) {
      // 点击资金中心
      await page.waitFor(3000)
      // 點擊資金
      await page.click(
        '#ae-layout > div.aside-menu > div > ul > li:nth-child(8) > div'
      )
      await page.waitFor(3000)
      // 點擊資金中心
      await page.click(
        '#ae-layout > div.aside-menu > div > ul > li:nth-child(8) > ul > li:nth-child(1)'
      )
      await page.waitForSelector('#Button_l417bsmb > button')
      await page.click('#Button_l417bsmb > button')
    }
  }
}
</script>
<style lang="scss" scoped>
.input {
  width: 600px;
  border: rgba($color: #000000, $alpha: 0.5);
  padding: 5px;
  margin-right: 10pxs;
}
</style>
