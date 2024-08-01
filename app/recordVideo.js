const { chromium } = require('playwright');

(async () => {
  // 启动 Chromium 浏览器
  const browser = await chromium.launch();
  // 创建一个浏览器上下文，启用视频录制
  const context = await browser.newContext({
    recordVideo: {
      dir: './videos', // 视频保存的目录
      size: { width: 720, height: 1280 }, // 视频大小
    },
  });
  // 创建一个新页面
  const page = await context.newPage();
  // 导航到您的 Next.js 应用页面
  await page.goto('http://localhost:3000/story/clz8j2q93000043umr5zxbp5q'); // 请替换为您的 Next.js 应用的 URL
  // 等待 10 秒
  await page.waitForTimeout(100000);
  // 关闭浏览器上下文，这将自动停止视频录制并保存文件
  await context.close();
  // 关闭浏览器
  await browser.close();
})();