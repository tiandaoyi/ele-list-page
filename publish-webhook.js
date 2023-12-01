const axios = require('axios')
const { execSync } = require('child_process')
const { name, version } = require('./package.json')
const webhookUrl = 'https://www.feishu.cn/flow/api/trigger-webhook/abcda05be3d07fcff64b795f42c15fd3'
// 获取最近的 commit 信息
const commitMessage = execSync('git log -1 --pretty=%B').toString().trim()
// 填充需要发送的参数
const payload = {
  name,
  dateTime: formatDateTime(new Date()),
  version, // 你的版本号
  npmUrl: `https://www.npmjs.com/package/${name}`, // 替换为你的包的 NPM 地址
  content: commitMessage,
}
// 发送 POST 请求
axios
  .post(webhookUrl, payload)
  .then((response) => {
    console.log('Webhook request successful:', response.data)
  })
  .catch((error) => {
    console.error('Error sending webhook request:', error.message)
  })

function formatDateTime(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
