# HTTP 请求

## 请求头

- Accept：浏览器可接受服务器的返回类型，`text/html`，`image/*`，`application/json`，`*/*`

- Accept-Encoding：浏览器接收的编码方式，通常指压缩方式，`gzip`，`deflate`
- Accept-Language：浏览器接收的语言，`zh-CN`
- Connection：连接方式
  - **close**：每个请求结束后，用于传输 HTTP 数据的 TCP 连接关闭，再次请求需要重新连接
  - keep-alive：客户端和服务器之间用于传输 HTTP 数据的 TCP 连接不会关闭
- Host：被请求资源的主机和端口号，通常由 URL 中提取，`www.baidu.com`
- Referer：发送请求的页面的 URL，`https://www.baidu.com/?_oem_dg`
- Origin：发起请求的 URL，只会精确到端口，比 Referer 更尊重隐私
- User-Agent：客户端操作系统和浏览器名称和版本，`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36`
- Cache-Control：控制缓存
  - **private**：私有缓存，不能在用户之间共享
  - public：共有缓存，能被用户间共享
  - no-cache：不缓存，实时向服务器请求资源，服务器再次计算响应资源
  - no-store：任何条件下都不缓存，并且不被写入磁盘，基于安全性，敏感性才考虑使用
  - max-age=10：设置缓存有效时间，单位秒
- Cookie：用于存储让服务器辨别用户身份的数据
- Range：用于断点续传，指定第一个字节的位置和最后一个字节的位置，用于告诉服务器想要哪部分，`Range: bytes=200-1000, 2000-6576`
- Date：客户端时间
- Access-Control-Request-Headers：预检请求(preflight)中用于通知真正的请求中会采用哪些请求头
- Access-Control-Request-Method：预检请求中用于通知真正的请求中会采用哪种请求方式


## 响应头

- Cache-Control：同请求头

- Connection：同请求头
- Content-Type：告诉客户端，资源文件的类型，还有字符编码，`text/html;charset=UTF-8`，`text/css`，`application/javascript`
- Content-Encoding：服务器资源编码方式，`gzip`，`deflate`
- Date：服务器时间
- Server：服务器和相对应的版本，`Tengine/1.4.6`
- Expires：告诉客户端在这个时间前，可以直接访问缓存，因为客户端和服务器的时间不一定会都是相同的，所以这个是没有`Cache-Control：max-age=*`准确的
- Last-Modified：请求对象最后修改时间，`Dec, 26 Dec 2015 17:30:00 GMT`
- Etag：资源被修改了，其 Etag 也会别修改，所以，ETag 的作用跟 Last-Modified 的作用差不多，可以用于判断一个对象是否改变了
- Access-Control-Allow-Origin
  - `*`：所有网站可以跨域资源共享
  - `www.baidu.com`：只能指定一个来源
  - `null`
- Access-Control-Allow-Credentials：告知浏览器是否可以将对请求的响应暴露给前端 JavaScript 代码
- Access-Control-Allow-Methods：预检请求响应中明确了客户端所要访问的资源允许使用的方法或方法列表
- Access-Control-Allow-Headers：列出了将会在正式请求种允许出现的请求头，`Accept`、`Accept-Language`、`Content-Language`、`Content-Type` 等简单首部始终是被支持的，不需要在这个首部特意列出


## 请求方式

- GET：获取查询数据
- POST：计算，处理资源
- PUT：替换资源
- PATCH：更新资源
- DELETE：删除资源
- OPTIONS：预检请求
- HEAD：与 GET 方式类似，但只返回首部不返回主体，可用于测试
- TRACE：用于测试目的，向目标发起一个请求，服务器会返回收到的请求信息，主要用于诊断
- CONNECT：创建隧道连接，用于加密和身份验证

## 状态码

- 1xx：信息提示
- 2xx：成功
  - 200：请求成功
- 3xx：重定向
  - 301：资源已被永久移动到新的位置
- 4xx：客户端错误
  - 403：无权访问
  - 404：服务器无法找到请求资源
- 5xx：服务端错误
  - 500：服务器端异常
  - 502：网关错误
  - 503：服务不可用，服务过载或维护
  - 504：网关超时
