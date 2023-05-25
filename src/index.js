const { serverStatus } = require('./mc-server-status');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// 定义路由
app.get('/api/status', (req, res) => {
  const { ip, port } = req.query;
  let response = getInfo(ip, port);
  res.json(response);
});
// 404 错误处理中间件
app.use((req, res, next) => {
  // res.redirect('https://www.minecraft.net');
});

// 启动服务器
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

function getInfo(ip, port) {
  let response = {
    ip: ip,
    port: port
  };
  try {
    response['info'] = 'success';
    let info = serverStatus({ host: ip, port: port, timeout: 6000 });
    response = { ...response, ...info };
  } catch (err) {
    response['info'] = 'fail';
    response['reason'] = err;
    console.log(err);
  }
  return response;
}