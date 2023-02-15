<template>
  <div class="hello">
    <input v-model="searchContent" @keydown.enter="search" class="input" />
    <button @click="search(searchContent)">启动</button>
  </div>
</template>

<script>
const puppeteer = require("puppeteer-core");
// const electron = require('electron')
// const puppeteer = require('puppeteer-core')
// const { spawn } = require('child_process')
function dumpFrameTree(frame, indent) {
  console.log(indent + frame.url());
  for (let child of frame.childFrames()) dumpFrameTree(child, indent + "  ");
}
export default {
  name: "HelloWorld",
  data() {
    return {
      searchContent:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",

      // '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      page: {},
      page2: {},
      target: {},
      browser: {},
    };
  },
  methods: {
    async search(context) {
      const browser = (this.browser = await puppeteer.launch({
        defaultViewport: {
          width: 850,
          height: 800,
        },
        headless: false,
        args: [
          "--start-fullscreen",
          "--no-sandbox",
          "--disable-blink-features=AutomationControlled",
          // "--disable-features=site-per-process",
          "--disable-web-security",
          "--disable-features=IsolateOrigins,site-per-process",
        ],

        // 除受控提示
        ignoreDefaultArgs: ["--enable-automation"],
        executablePath: context,
        // "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      }));
      this.target = await browser.target();
      const page = (this.page = await browser.newPage());
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, "plugins", {
          get: () => [1, 2, 3, 4],
        });
      });
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36"
      );
      await page.evaluate(() => {
        Object.defineProperties(navigator, { webdriver: { get: () => false } });
      });
      await page.evaluate(() => {
        window.navigator.chrome = { runtime: {} };
      });
      await page.evaluate(() => {
        Object.defineProperty(navigator, "languages", {
          get: () => ["en-US", "en"],
        });
      });

      await page.evaluate(() => {
        Object.defineProperty(navigator, "plugins", {
          get: () => [1, 2, 3],
        });
      });
      await page.goto(
        "https://login.aliexpress.com/seller.htm?return_url=http%3A%2F%2Fgsp.aliexpress.com%2F",
        {
          waitUntil: "networkidle2",
        }
      );

      console.log("等待中");

      let that = this;
      browser.on("targetcreated", async (target) => {
        console.log("target", target.type());
        if (target.type() === "page") {
          that.page2 = await target.page();
        }
      });

      let frame = await page.frames().find((f) => f.name() === "");
      console.log("等待中frame", frame);

      const childframe2 = (await frame.childFrames())[0];
      await childframe2.waitForSelector("#fm-login-submit", { timeout: 0 });
      await childframe2.waitFor(3000);

      await childframe2.click("#fm-login-id"); //
      await childframe2.type("#fm-login-id", "fossafrong@163.com", {
        delay: Math.random() * 10,
      });
      await childframe2.click("#fm-login-password"); // '百度一下'按钮的id. 注释3
      await childframe2.type("#fm-login-password", "w921533w", {
        delay: Math.random() * 10,
      });
      await childframe2.waitFor(1000);
      await childframe2.click("#fm-login-submit"); // 点击登录按钮

      await childframe2.waitFor(3000);
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
        await page.waitFor(1000);
        await page.mouse.down();
        await page.mouse.move(spanInfo.x + 271, spanInfo.y + 11, {
          steps: 20,
        });

        await page.mouse.up();
      }
      await childframe2.click("#fm-login-submit"); // 点击登录按钮

      await page.waitForSelector(".next-menu-sub-menu-wrapper");
      await this.withdraw();
      await this.cardwait();
      await this.zfbPassword();
    },
    async withdraw(page) {
      // 点击资金中心
      await this.page.waitFor(3000);
      const dialog = this.page.waitForSelector(".next-dialog-close", {
        timeout: 1000,
      });
      console.log("dialog=>", dialog);
      if (dialog) {
        await this.page.click(".next-dialog-close");
      }
      await this.page.waitFor(1000);

      // 點擊資金
      await this.page.click(
        "#ae-layout > div.aside-menu > div > ul > li:nth-child(8) > div"
      );
      await this.page.waitFor(3000);
      // 點擊資金中心
      await this.page.click(
        "#ae-layout > div.aside-menu > div > ul > li:nth-child(8) > ul > li:nth-child(1)"
      );
      await this.page.waitForSelector("#Button_l417bsmb > button");
      await this.page.click("#Button_l417bsmb > button");
      await this.page.waitFor(10000);
    },
    async cardwait() {
      await this.page2.bringToFront();
      // 等待转账按钮
      let btnZZ =
        "#root > div > section > section > div > main > div > div > div > div > div > section > section > div > main > div > div > div > div > div > div > div > div > div > div > div.ant-col.ant-col-17 > div:nth-child(2) > div > div > div > div.ant-col.ant-col-16 > section > section.tr > button.ant-btn.mw80.mr8";
      await this.page2.waitForSelector(btnZZ);
      await this.page2.waitFor(5000);

      await this.page2.click(btnZZ); // 点击该链接将间接导致导航(跳转)
      await this.page2.waitFor(1000);

      // 點擊資金
      const btnOptions =
        "#root > div > section > section > div > main > div > div > div > div > div > section > section > div > main > div > div.ant-pro-grid-content > div > div > div > div > div > div > div > div.ant-card-body > section > form > div > div.ant-col.ant-form-item-control.ant-col-xs-24.ant-col-sm-16";
      await this.page2.waitForSelector(btnOptions);
      await this.page2.click(btnOptions);
      await this.page2.waitFor(1000);
      // 下拉勾选第一个
      const btnSelect =
        "#root > div > section > section > div > main > div > div > div > div > div > section > section > div > main > div > div:nth-child(2) > div > div > div > div.rc-virtual-list > div.rc-virtual-list-holder > div > div > div.ant-select-item.ant-select-item-option.ant-select-item-option-active.ant-select-item-option-selected";

      await this.page2.waitForSelector(btnSelect);
      // await this.page2.click(btnSelect);
      await this.page2.waitFor(1000);

      // 點擊資金中心 const html = await page.$eval('.main-container', e => e.outerHTML);
      const p =
        "#root > div > section > section > div > main > div > div > div > div > div > section > section > div > main > div > div.ant-pro-grid-content > div > div > div > div > div > div > div > div.ant-card-body > div.ant-row > div > form > div:nth-child(4) > div:nth-child(2) > div.ant-col.ant-form-item-control.ant-col-xs-24.ant-col-sm-16 > div > div > p";
      await this.page2.waitForSelector(p);
      const html = await this.page2.$eval(p, (e) => e.innerText);
      console.log(html);
      const money = html.replace(" USD", "");
      console.log(money);

      await this.page2.type("#applyAmount", money, {
        delay: Math.random() * 10,
      });

      await this.page2.type("#remarks", money, {
        delay: Math.random() * 10,
      });

      await this.page2.waitFor(1000);
      const btn_next =
        "#root > div > section > section > div > main > div > div > div > div > div > section > section > div > main > div > div.ant-pro-grid-content > div > div > div > div > div > div > div > div.ant-card-body > div.ant-row > div > form > div:nth-child(6) > div > div > div > button.ant-btn.ant-btn-primary.ant-btn-lg.largeBtn___JqxDa";
      await this.page2.click(btn_next);
    },
    async zfbPassword() {
      await this.page2.waitForSelector("#password");
      await this.page2.type("#password", "cw1992", {
        delay: Math.random() * 10,
      });
      await this.page2.click(
        "#root > div > section > section > div > main > div > div > div > div > div > section > section > div > main > div > div > div > div > div > div > div > div > div > div.ant-card-body > div.transferAccountWrapper___2jPXM > form > div.footerControl___15hTG > div > div > div > div > button.ant-btn.ant-btn-primary.ant-btn-lg.mw120"
      );
      await this.page2.waitFor(4000);
      await this.page2.keyboard.type("123456");
      // 获取所有iframe
      // let iframes = await this.page2.frames().find((f) => f.name() === "");

      const iframes = await this.page2.$$("iframe");

      console.log(iframes);
      // const elementHandle = await page.$(
      //   'iframe[src="https://render.antfin.com"]'
      // );
      const iframe = iframes[6];

      // await childframe.waitForSelector('#data > div > div', { timeout: 0 })
      // console.log('等待结束')
      // await frame.click(btn);
      // await iframe.evaluate(() => {

      //       const btns = [];
      //       btns.forEach(btn => btn.click());
      //   });
      // console.log("结束");
      // await element.click();
      await this.page2.evaluate(() => {
        setTimeout(() => {
         
          document.querySelector("#root > div > div > div > div > form > div.verify-actions___1maNo > button").click();
        }, 2000);

        //这里.parentElement()是获取最近的parentElement，如果期望获取的父元素不是最近的父元素，那么需要多次调用parentElement
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.input {
  width: 600px;
  border: rgba($color: #000000, $alpha: 0.5);
  padding: 5px;
  margin-right: 10pxs;
}
</style>
