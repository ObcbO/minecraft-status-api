const util = require('minecraft-server-util');
const express = require('express');
const app = express();
const options = {
  timeout: 1000 * 5, // timeout in milliseconds
  enableSRV: true // SRV record lookup
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// 定义路由
app.get('/api/status', async (req, res) => {
  const { ip, port } = req.query;
  try {
    let info = util.status(ip, parseInt(port) || 25565, options);
  } catch (error) {

  }
  util.status(ip, parseInt(port) || 25565, options)
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  //res.json();
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