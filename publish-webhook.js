const axios = require('axios')
const { execSync } = require('child_process')
const readline = require('readline');
const { name, version } = require('./package.json')
const fs = require('fs')

async function main() {
  const configPath = 'private-config.json'
  let config = {}
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  } else {
    console.log(`没有找到${configPath}配置文件，无法发送webhook通知`)
    return
  }
  if (!config || !config.webhookUrl) {
    console.log(`没有找到${configPath}配置的webhookUrl`)
    return
  }
  const webhookUrl = config.webhookUrl
  // 获取最近的 commit 信息
  const commitMessage = execSync('git log -1 --pretty=%B').toString().trim()

  // 使用 readline 提示用户输入影响范围
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n\n\n')
  // 配置命令行指令
  const reach = await questionAsync('请输入影响范围（如果无，请直接回车）: ', rl)
  const isRequired =
    (await questionAsync('该版本是否必须更新？请输入y/n(默认为否): ', rl)).toLowerCase().trim() === 'y'
  console.log('\n')

  // 填充需要发送的参数
  const payload = {
    name,
    dateTime: formatDateTime(new Date()),
    version, // 你的版本号
    npmUrl: `https://www.npmjs.com/package/${name}`, // 替换为你的包的 NPM 地址
    content: commitMessage,
    reach: reach || '无',  // 如果用户没有输入，则默认为 '无'
    isRequired: isRequired ? '是' : '否',
  }

  axios
  .post(webhookUrl, payload)
  .then((response) => {
    console.log('Webhook request successful:', response.data)
  })
  .catch((error) => {
    console.error('Error sending webhook request:', error.message)
  })
  .finally(() => {
    rl.close()
    process.exit(0)
  })
}

main()

function formatDateTime(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function questionAsync(query, rl) {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}
