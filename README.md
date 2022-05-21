# ShareWarp
### 基于 Liteloader Script Engine 的一个 Bedrock Dedicated Server 插件
![Liscense](https://img.shields.io/github/license/Moxiner/ShareWarp)
![Downloads](https://img.shields.io/github/downloads/Moxiner/ShareWarp/total)
![Release](https://img.shields.io/github/v/release/Moxiner/ShareWarp)
![BDS](https://img.shields.io/badge/support--LLSE--version-Newest-red)
![CodeFactor](https://www.codefactor.io/repository/github/Moxiner/ShareWarp/badge)  

## 【前提&概念】
* 每个 Warp 会有一个唯一 WarpID，在 Warp 上传时，WarpID 将会自动生成
* 每位玩家都会有三个传送点列表
  * 全局：所有玩家上传的公共传送点
  * 收藏：玩家自己收藏的公共传送点
    * 上传传送点时，传送点只会出现在个人公共传送中，不会同步到收藏公共传送点
  * 个人：玩家自己上传的公共传送点

## 【指令介绍】
| 指令内容|	指令描述
----|----|
|/sharewarp help	ShareWarp 指令帮助
|/sharewarp \[ list ; tp ] \[ WarpID ] |打开传送点列表 【List：全局公共传送点，Star：收藏公共传送点】
|/sharewarp update |上传公共传送点
|/sharewarp manage \[ star ; ponser ; global ] \[ WarpID ]	|管理传送点 【Star：收藏公共传送点，Ponser：个人公共传送点，Global：全局公共传送点 】
**【注意】\[WarpID] 为可选参数 ，不填写打开列表，填写时直接跳转到该 WarpID 的传送点

## 【使用方法】
* 【step 1】请先安装 [LiteLoaderBDS](https://github.com/LiteLDev/LiteLoaderBDS) 前置加载器
* 【step 2】将本插件丢进 BDS根目录 *\plugins\* 文件夹中
* 【step 3】启动服务器，并看到控制台有以下输出
```
TIME INFO [ShareWarp] ShareWarp 加载完成
TIME INFO [ShareWarp] 作者: 莫欣儿 版本: 1.0.0
```

## 【说明】
* 【1】本插件没有配置文件（之后会做，大概）╰(￣ω￣ｏ)
* 【2】本插件没有接入经济系统（之后会做，大概）╰(￣ω￣ｏ)
* 【3】本插件的传送点数据由明文，请注意数据安全 (っ °Д °;)っ
* 【4】如果有部分操作无反应或多次触发，请检查所有 Warp 的 WarpID 是否重复
* 【5】**请不要让其中两个 Warp 的 WarpID 重复，若重复，请去相应数据文件修改**
* 【6】**发现重复时，请不要执行删除 Warp 指令！！ (っ °Д °;)っ**
* 【7】**修改文件时，请保证三个文件的 Warp 数据保持同步**

## 【数据文件】
### 【路径】\[ plugins/ShareWarp/... ]
### 【注意】
**请使用带有 Json 检查 的编辑器 进行数据编写和修改，请确保 Json 格式 和 编码 正确！ (ﾟДﾟ*)ﾉ**
**请注意同步三个文件的 Warp 信息！ヾ(•ω•`)o**
### 【date.js】储存全局传送点
```
[
    {
        "id": "233",
        "name": "这是一个测试传送点",
        "des": "这是一个测试传送点的描述",
        "op": "Moxiners",
        "post": [
            -220.93909,
            73,
            297.97467,
            "Overworld"
        ]
    },
    {
...
}
]
```
### 【playerdate.js】储存每位玩家的个人传送点**
### 【stardate.js】储存每位玩家的收藏传送点**
```
{
    "Moxiners": [
        {
            "id": "3",
            "name": "这是一个测试传送点",
            "des": "这是一个测速传送点的描述",
            "op": "Moxiners",
            "post": [
                -220.93909,
                73,
                297.97467,
                "Overworld"
            ]
        },
        {
        ...
        }
    ],
    Player:{
            ...
        }
}
```

## 【图片欣赏】
### 【GUI界面】
![GUI效果](https://www.minebbs.com/attachments/png.28611/)
![GUI效果](https://www.minebbs.com/attachments/png.28612/)

### 【聊天窗口通知】
![游戏效果](https://www.minebbs.com/attachments/png.28613/)

## 【最后】
* 【1】本插件可以整合，但请保证版本更新为最新版
* 【2】本插件原则不可商用，但如果商用整合，请经 Moxiner 授权！
* 【3】好用的话，一定要Star哦！这样 Moxiner 才会有动力哦！ヽ(￣ω￣(￣ω￣〃)ゝ
* 【4】如果有 问题/Bug 或 建议/意见 请去 [QQ群](https://jq.qq.com/?_wv=1027&k=CRO8Gw4C) 或 [Github Issues](https://github.com/Moxiner/ShareWarp/issues) 中提出 ╰(￣ω￣ｏ)
* 【5】如果加入 [QQ群](https://jq.qq.com/?_wv=1027&k=CRO8Gw4C)，礼貌提问，如果是 Moxiner 的插件，反馈时记得 [@Moxiner](https://github.com/Moxiner) 哦！
* 【6】最后，感谢 LLSE 群友 的帮助！（还有柳姐姐的鼓励！o(*////▽////*)q ）

*Copyright © 2022 Moxiner (or Moxiners). All Rights Reserved.*
