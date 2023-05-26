const util = require('minecraft-server-util');
const express = require('express');
const app = express();
const port = 443;
const be_options = {
  enableSRV: true // SRV record lookup
};
const je_options = {
  timeout: 1000 * 5, // timeout in milliseconds
  enableSRV: true // SRV record lookup
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// 定义路由
app.get('/api/status', async (req, res) => {
  let { ip, port, edition } = req.query;
  port = parseInt(port) || (edition == "be") ? 19132 : 25565;
  edition = (edition == "") ? "je" : edition;
  let response = {
    ip: ip,
    port: port,
    edition: edition
  };
  try {
    response['status'] = 'success';
    switch (edition) {
      case "be":
        response['info'] = await util.statusBedrock(ip, port, be_options);
        break;
      case "je":
      default:
        response['info'] = await util.status(ip, port, je_options);
    }
  } catch (error) {
    response['status'] = 'fail';
  }
  res.json(response);
});
// 404 错误处理中间件
app.use((req, res, next) => {
  res.redirect('https://www.minecraft.net');
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
