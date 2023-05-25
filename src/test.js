const net = require('net');

function getStatus(ip, port) {
  return new Promise((resolve, reject) => {
    const client = net.connect(port, ip, () => {
      // 发送 Server List Ping 数据包（packet）
      const packet = Buffer.from([
        0xFE,
        0xFD,
        0x00,
        0x17,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
      ]);
      client.write(packet);
    });

    client.setTimeout(5000); // 设置超时时间为 5 秒

    let response = '';

    // 监听数据接收事件
    client.on('data', (data) => {
      response += data.toString('utf-8');
    });

    // 监听连接关闭事件
    client.on('close', () => {
      const data = parseResponse(response);
      resolve(data);
    });

    // 监听错误事件
    client.on('error', (err) => {
      reject(err);
    });

    // 解析 Status Response 数据
    function parseResponse(response) {
      const [motd, onlinePlayers, maxPlayers] = response.split('\x00\x00\x00');
      const protocolVersion = parseInt(response.charAt(3));
      const serverVersion = response.substring(
        response.indexOf('\x00') + 1,
        response.indexOf('\x00', 4)
      );
      const favicon = response.includes('\x01') ? response.substring(response.indexOf('\x01') + 2, response.indexOf('\x00', response.indexOf('\x01') + 2)) : null;

      return {
        protocolVersion,
        serverVersion,
        motd,
        onlinePlayers: parseInt(onlinePlayers),
        maxPlayers: parseInt(maxPlayers),
        favicon,
      };
    }
  });
}

// 使用示例
getStatus('mc.whiteg.cn', 25565)
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
