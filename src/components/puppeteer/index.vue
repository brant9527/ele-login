<template>
  <div class="hello">
    <input v-model="searchContent" @keydown.enter="search" />
    <button @click="search(searchContent)">Search</button>
  </div>
</template>

<script>
const puppeteer = require("puppeteer-core");
// const electron = require('electron')
// const puppeteer = require('puppeteer-core')
// const { spawn } = require('child_process')
export default {
  name: "HelloWorld",
  data() {
    return {
      searchContent: "",
    };
  },
  methods: {
    async search(context) {
      // spawn(
      //   electron,
      //   ['./electron', '--remote-debugging-port=9200'],
      //   {
      //     shell: true
      //   }
      // )
      // const app = await puppeteer.connect({
      //   browserURL: 'http://localhost:9200'
      // })
      const browser = await puppeteer.launch({
        defaultViewport: {
          width: 850,
          height: 800,
        },
        headless: false,
        // 除受控提示
        ignoreDefaultArgs: ["--enable-automation"],
        executablePath:
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        // executablePath:
        //   '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      });
      const page = await browser.newPage();
      await page.goto(
        "https://login.aliexpress.com/seller.htm?&return_url=https://gsp.aliexpress.com",
        {
          waitUntil: "networkidle2",
        }
      );
      console.log("等待中");
      // const frame = await page.$('iframe')

      let frame = await page.frames().find((f) => f.name() === "");
      console.log("等待中frame", frame);

      const childframe2 = (await frame.childFrames())[0];
      await childframe2.waitForSelector("#fm-login-submit", {
        timeout: 0,
      });

      console.log("超时");

      await childframe2.click("#fm-login-id"); //
      await childframe2.type("#fm-login-id", "fossafrong@163.com");
      await page.waitFor(1000);

      await childframe2.click("#fm-login-password"); // '百度一下'按钮的id. 注释3
      await childframe2.type("#fm-login-password", "w921533w");
      await page.waitFor(1000);

      await childframe2.click("#fm-login-submit"); // 点击登录按钮
      await page.waitFor(3000);
      frame = await childframe2.childFrames();
      console.log("frame=>", frame);
      const slideFrame = frame[0];
      if (slideFrame) {
        const slidebtn = await slideFrame.$(".btn_slide");
        console.log("slidebtn=>", slidebtn.boundingBox());
        const { x, y } = await slidebtn.boundingBox();
        console.log(x, y);
        slidebtn.boundingBox();
        // const btnPosition = await this.getBtnPosition(slideFrame)
        const spanInfo = await slidebtn.boundingBox();
        slidebtn.focus();
        await page.mouse.move(spanInfo.x + 21, spanInfo.y + 11);
        await page.waitFor(3000);

        await page.mouse.down();
        await page.mouse.move(spanInfo.x + 271, spanInfo.y + 11,{steps:10});

        await page.mouse.up();
      }
    },
  },
};
</script>
