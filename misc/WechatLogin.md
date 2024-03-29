# 微信登陆

## OAuth2.0授权机制

> OAuth 2.0 is the industry-standard protocol for authorization. OAuth 2.0 focuses on client developer simplicity while providing specific authorization flows for web applications, desktop applications, mobile phones, and living room devices. 

场景：快递员问题
1. 我住在一个大型的居民小区。
2. 小区有门禁系统。
3. 我经常寄快递，经常都有快递员来取货。我必须找到一个办法，让快递员通过门禁系统，进入小区。
4. 如果我把自己的密码，告诉快递员，他就拥有了与我同样的权限，这样好像不太合适。万一我想取消他进入小区的权力，也很麻烦，我自己的密码也得跟着改了，还得通知其他的快递员。

于是，我设计了一套授权机制。
第一步，门禁系统的密码输入器下面，增加一个按钮，叫做"获取授权"。快递员需要首先按这个按钮，去申请授权。
第二步，他按下按钮以后，我的手机就会跳出对话框：有人正在要求授权。系统还会显示该快递员的姓名、工号和所属的快递公司。我确认请求属实，就点击按钮，告诉门禁系统，我同意给予他进入小区的授权。
第三步，门禁系统得到我的确认以后，向快递员显示一个进入小区的令牌。令牌就是类似密码的一串数字，只在七天内有效。
第四步，快递员向门禁系统输入令牌，进入小区。

## 微信登录准备工作

[微信开放平台](https://open.weixin.qq.com/cgi-bin/frame?t=home/web_tmpl&lang=zh_CN) 注册并且创建应用，申请接入，成功后会获得 AppID 和 AppSecret
<div style="text-align:center"><img src="@/WXLogin.png"/></div>

## 请求过程
<div style="text-align:center"><img src="@/WXLoginFlow.png"/></div>

### 获取登录二维码
在页面中先引入如下 JS 文件（支持https，可考虑使用 ahooks 的 useExternal） 
> http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js

``` typescript
const obj = new WxLogin(wxLoginParam)  // new Window.WxLogin()

export interface WxLoginParam {
  id: string; // 第三方页面显示二维码的容器 id
  appid: string; // 应用唯一标识，在微信开放平台提交应用审核通过后获得
  redirect_uri: string; // 重定向地址，需要进行UrlEncode,encodeURIComponent(url)
  self_redirect?: boolean; // 在 top window(false)/iframe(true) 跳转
  scope: string; //应用授权作用域,'snsapi_login'
  state?: string; //用于保持请求和回调的状态，授权请求后原样带回给第三方。
  style?: 'black' | 'white'; // 二维码样式
  href?: string; //自定义二维码样式链接
}

```

### 请求 code

code（授权临时票据）用于获取 access_token，一个 code 只能成功换取一次access_token即失效
``` typescript
request({
   type: 'GET' 
   url: 'https://open.weixin.qq.com/connect/qrconnect'
   param: CodeParam
})

type CodeParam = Pick<WxLoginParam, 'appid' | 'redirect_uri' | 'scope' | 'state'> & {
  response_type: 'code';
  lang?: 'cn' | 'en';
};

```

用户允许授权后，将会重定向到 redirect_uri 的网址上，并且带上 code 和 state 参数


### 通过 code 换取 access_token
``` typescript

request({
   type: 'GET' 
   url: 'https://api.weixin.qq.com/sns/oauth2/access_token' // 1w/min
   param: AccessTokenParam
})

interface AccessTokenParam {
  appid: string;
  secret: string; // 应用密钥 AppSecret
  code: string;
  grant_type: 'authorization_code';
}

export interface AccessTokenResponse {
  access_token: string; // 接口调用凭证
  expires_in: number; // 超时时间（秒）
  refresh_token: string; // 用于刷新access_token
  openid: string; // 授权用户唯一标识
  scope: string; // 用户授权的作用域
  /**
   * @description 同一个微信开放平台帐号下的移动应用、网站应用和公众帐号，用户的unionid是唯一的
   * @description 用于不同应用中进行用户信息互通
  */
  unionid: string;
}

const AccessTokenError = { errcode: 40029, errmsg: 'invalid code' };

```

### 通过 access_token 获取用户基本信息

``` typescript
request({
   type: 'GET' 
   url: 'https://api.weixin.qq.com/sns/userinfo' // 5w/min
   param: AccessTokenParam
})

interface UserInfoParam {
  access_token: string,
  openid: string,
  lang: 'en' | 'zh_CN' | 'zh_TW' = 'en'
}

export interface UserInfo {
  openid: string;
  nickname: string;
  sex: 1 | 2; // 1为男性，2为女性
  province: string;
  city: string;
  country: string;
  /**
   * @description 用户头像
   * @description 最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像）
   * @description 用户没有头像时该项为空，修改微信头像后该 url 会失效
   * @example https://thirdwx.qlogo.cn/mmopen/g3MHkdmze/0
   */
  headimgurl: string;
  privilege: string;
  unionid: string;
}

```

### 刷新或续期 access_token 使用
   
由于 access_token 有效期较短，当 access_token 超时后，可以使用 refresh_token 30天进行刷新，如果已超时会得到一个新的，未超时则续期

``` typescript
request({
   type: 'GET' 
   url: 'https://api.weixin.qq.com/sns/oauth2/refresh_token' // 5w/min
   param: RefreshTokenParam
})

interface RefreshTokenParam {
  appid: string;
  grant_type: 'refresh_token';
  refresh_token: string;
}

type RefreshTokenResponse = Omit<AccessTokenResponse, 'unionid'>;

const RefreshTokenError = { errcode: 40030, errmsg: 'invalid refresh_token' };
```

## 组件

``` typescript

const WechatQRCodeContainerId = 'WECHAT_QR_CODE_CONTAINER';

const WxExternalURL = '//res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js';

const BaseWxLoginConfig = {
  lang: 'cn',
  style: 'black',
  response_type: 'code',
  scope: 'snsapi_login',
  self_redirect: true,
  id: WechatQRCodeContainerId,
  state: Math.round(Math.random() * 10000),
};

interface WechatQRCodeProps {
  appId: string;
  onSuccess: (code: string) => void;
  host: string;
  width?: number;
  height?: number;
  redirectPath?: string;
}
export default function WechatQRCode({
  onSuccess,
  appId,
  host,
  width = 300,
  height = 400,
  redirectPath = '/redirect',
}: WechatQRCodeProps) {
  const status = useExternal(WxExternalURL, { js: { async: true } });

  const handleSuccess = usePersistFn(onSuccess);

  useEffect(() => {
    if (status === 'ready' && host && appId) {
      // @ts-ignore
      // eslint-disable-next-line no-new
      new WxLogin({
        ...BaseWxLoginConfig,
        appid: appId,
        href: DefaultStyle,
        redirect_uri: encodeURIComponent(`${document.location.protocol}//${host}${redirectPath}`),
      });
      const container = document.getElementById(WechatQRCodeContainerId);
      const iframe = container?.children[0] as HTMLIFrameElement;
      iframe.width = String(width);
      iframe.height = String(height);
      iframe.onload = () => {
        // 本地会出现跨域问题
        const doc = iframe.contentDocument;
        if (!doc) {
          return;
        }
        const param = new URLSearchParams(doc.location.search);
        const code = param.get('code');
        if (code) { 
          handleSuccess(code);
        }
      };
    }
  }, [appId, handleSuccess, height, host, redirectPath, status, width]);

  return <div className={styles.qrCode} id={WechatQRCodeContainerId} />;
}


```

## Tips

1. AppSecret，accessToken，refreshToken 是应用接口使用密钥，泄漏后将可能导致应用数据泄漏、应用的用户数据泄漏等高风险后果；存储在客户端，极有可能被恶意窃取；
建议将 AppSecret、accessToken 放在服务器
2. WxLoginParam.state 可用于防止 csrf 攻击，建议第三方带上该参数，可设置为简单的随机数加 session 进行校验
3. WxLoginParam.href（自定义二维码样式） ，如果是链接必须是 https ，除了放链接还可以将写好的样式文件进行 base64 转码
4. 授权作用域（scope）代表用户授权给第三方的接口权限，网页应用目前仅填写 'snsapi_login'
5. code 的超时时间为10分钟，access_token 有效期为2个小时，refresh_token 有效期30天
6. 本地调试会有跨域的问题，会比较麻烦


## 参考
1. [微信官方开发文档](https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html)
2. [OAuth2.0](https://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html)
