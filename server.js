const http = require('http');
const fs = require('fs');
const path = require('path');
const csvContent = `名称,年龄,城市\nJohn,30,New York\nAnna,22,Los Angeles`;
// const csvContent = `\ufeff名称,年龄,城市\nJohn,30,New York\nAnna,22,Los Angeles`;
const csvFilePath = path.join(__dirname, 'data.csv');

// 将CSV内容转换为Buffer，并添加BOM
const csvBuffer = Buffer.from(csvContent, 'utf-8');
const csvBufferWithBom = Buffer.concat([
  Buffer.from([0xef, 0xbb, 0xbf]),
  csvBuffer,
]);

// 保存CSV文件（示例中直接使用Buffer）
fs.writeFileSync(csvFilePath, csvBufferWithBom);

// fs.writeFileSync(csvFilePath, csvBuffer);

const server = http.createServer((req, res) => {
  if (req.url === '/download' && req.method === 'GET') {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=export.csv');
    fs.createReadStream(csvFilePath).pipe(res); // 发送文件流作为响应
  } else {
    fs.readFile('./index.html', 'utf-8', (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Server error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
