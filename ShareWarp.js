// 全局变量
let PLUGIN_NAME = "ShareWarp";
let PLUGIN_DESCRIPTION = "LLSE 共享公共传送点 [输入 ll plugins ShareWarp 查看具体信息]";     //插件描述
let VERSION = [0, 8, 2];
let AUTHOR = "莫欣儿";
let CONNECT = "QQ Group : 850517473"
let CONFIG = {
    PATH: "./plugins/ShareWarp",
    LIST: "Date.json",
    PONSER: "PlayerDate.json",
    STAR: "StarDate.json"
}
var WarpList = []
var PlayerWarp = {}
var ManageMode = []
var Ready = {}
/* 注册插件 & 插件信息 */
ll.registerPlugin(PLUGIN_NAME, PLUGIN_DESCRIPTION, VERSION,
    {
        "Author": AUTHOR,
        "Connect": CONNECT
    });

/** 文件操作 */
var FileOppeate = {
    /** 写入文件 
 * @param filePath 文件路径
 * @param fileName 文件名称
 * @param content 内容
 * @return configForm 内容
 */
    FileWrite: function (filePath, fileName, content) {
        try {
            if (File.exists(filePath)) {

            }
            File.mkdir(filePath);
            File.writeTo(`${filePath}/${fileName}`, content);
        } catch {
            logger.error(`[Error] ${fileName} 文件写入失败`)
            logger.error(`[Error] 请使用带有 Json 格式高亮的编辑器进行改正`)
        }
    },
    /** 读取文件 
     * @param path 文件路径
     * @param fileName 文件名称
     * @return configForm 内容
     */
    FileRead: function (path, fileName) {
        try {
            var configForm = File.readFrom(`${path}\\${fileName}`);
            configForm = eval(`(${configForm})`)
        } catch {
            logger.error(`[Error] ${fileName} 文件读取失败`);
            logger.error(`[Error] 请使用带有 Json 格式高亮的编辑器进行改正`)
        }
        return configForm;
    }
}
/* GUI创建 */
var GUI = {
    /** 上传 GUI
 * @param pl 玩家对象
 * @param callback 回调函数
 */
    Upadte: function (pl, callback) {
        var fm = mc.newCustomForm();
        fm.setTitle("上传传送点");
        fm.addInput("传送点名称");
        fm.addInput("这个传送点的描述");
        pl.sendForm(fm, callback)
    },
    /** 管理 GUi
     * @param pl 玩家对象
     * @param warpName 领地名称
     * @param callback 回调函数
     */
    Manage: function (pl, warpName, callback) {
        var fm = mc.newSimpleForm();
        fm.setTitle(warpName)
        fm.addButton("删除");
        fm.addButton("查看");
        fm.addButton("返回");
        pl.sendForm(fm, callback)
    },
    Ready: function (pl, callback) {
        var fm = mc.newSimpleForm();
        fm.setTitle("你确定吗？")
        fm.addButton("取消");
        fm.addButton("确定");
        pl.sendForm(fm, callback)
    },

    /** 详情 GUI
 * @param pl 玩家对象
 * @param warpName 领地名称
 * @param content 显示内容
 * @param callback 回调函数
 */
    describe: function (pl, warpName, content, callback) {
        var fm = mc.newSimpleForm();
        fm.setTitle(warpName)
        fm.setContent(content)
        fm.addButton("收藏");
        fm.addButton("传送");
        fm.addButton("返回");
        pl.sendForm(fm, callback)

    },
    /** 传送点列表 GUI 
 * @param pl 玩家对象
 * @param warpName 领地名0称
 * @param callback 回调函数
 */
    warp: function (pl, warplist, callback) {
        var fm = mc.newSimpleForm();
        fm.setTitle("传送点列表")
        fm.setContent("请选择传送点")
        for (i in warplist) {
            fm.addButton(warplist[i]);
        }
        pl.sendForm(fm, callback);
    }
}
/* 处理数据 */
var DateDeal = {
    /**  初始化文件 
     * @param filePath 文件路径
     * @param fileName 文件名称
     * @param content 内容
     * 
    */
    Initialize: function (filePath, fileName, content) {
        try {
            if (File.exists(`${filePath}/${fileName}`) == 0) {
                FileOppeate.FileWrite(filePath, fileName, content)
            }
        } catch {
            logger.error(`[Error] ${fileName} 初始化失败`)
            logger.error(`[Error] 请删除 ${fileName} 文件,并重启服务器!`)
        }
    },
    /** 生成传送点唯一序列号 
     * @return 唯一序列号
     * */
    MakeId: function () {
        warp = DateDeal.ReadWarpID(null, CONFIG.PATH, CONFIG.LIST)
        var ID = 0
        for (i in warp) {
            if (warp[i] != ID) {

            } else {
                ID = ID + 1
            }
        }
        return ID
    },
    /** FloatPos 转化为 StringPos */
    StringToPost: function (post) {
        var worldReg = /[\u4e00-\u9fa5]+/i;
        var posReg = /\([^\)]+\)/i;
        world = worldReg.exec(post)
        post = String(posReg.exec(post))
        StrPos = `[${post.substring(1, post.length - 1)} , "${world}"]`
        StrPos = JSON.parse(StrPos);

        return StrPos
    },
    /** 更新每个玩家用到的 Warp List
    * @param filePath 文件地址
    * @param warpName 文件名称
    * @param pl 玩家对象
    * @param mode 读取文档的模式
    * @return 传送点列表
    */
    ReadWarp: function (filePath, fileName, pl, mode) {
        let warpList = []
        var warp = FileOppeate.FileRead(filePath, fileName);
        if (mode != null) {
            let playername = pl.name
            warp = warp[playername]
            for (var i in warp) {
                warpList.push(warp[i].name)
            }
        } else {
            for (var i in warp) {
                warpList.push(warp[i].name)
            }
        }
        return warpList
    },
    /** Warp 详情化
     * @description Warp 详情化并弹出详情GUI
     * @param pl 玩家数据
     * @param date 表单数据
     */
    DescribeWarp: function (pl, date) {
        if (date != null) {
            let warp = FileOppeate.FileRead(CONFIG.PATH, CONFIG.LIST)[date]
            let warpName = warp.name
            PlayerWarp[`${pl.name}`] = warp
            let content = `
§bWarpID:  §6${warp.id}
§b详 情:  §6${warp.des}
§b贡献者: §6${warp.op}
§b位 置:  §6坐标§e ${warp.post[0]} ${warp.post[1]} ${warp.post[2]} 
        §6维度§e ${warp.post[3]}
            `
            GUI.describe(pl, warpName, content, DateDeal.DealDescribeWarp)

        }

    },
    /** 详情 GUI 处理
    * @description 处理 详情 GUI 的返回结果
    * @param pl 玩家数据
    * @param date 表单数据
    */
    DealDescribeWarp: function (pl, date) {
        switch (date) {
            case 0:
                let content = PlayerWarp[pl.name]
                // DateDeal.WritePlayerWarp(CONFIG.PATH , CONFIG.STAR , pl ,content)
                DateDeal.StarWarp(pl, content)
                return false
            case 1:
                var post = PlayerWarp[pl.name].post
                DateDeal.TpWarp(pl, post)
                return false
            case 2:
                GUI.warp(pl, WarpList[pl.name], DateDeal.DescribeWarp)
                return false
        }
    },
    /** 上传 Warp
    * @description 上传 Warp 到 LiST 和 PONSER
    * @param pl 玩家数据
    * @param date 表单数据
    */
    UpdateWarp: function (pl, date) {
        if (date != null) {
            id = DateDeal.MakeId()
            nama = date[0]
            des = date[1]
            op = pl.name
            post = DateDeal.StringToPost(String(pl.pos))
            let content =
            {
                id: `${id}`,
                name: `${nama}`,
                des: `${des}`,
                op: `${op}`,
                post: post
            }
            DateDeal.WriteDateWarp(CONFIG.PATH, CONFIG.LIST, content)
            DateDeal.WritePlayerWarp(CONFIG.PATH, CONFIG.PONSER, pl, content)
            pl.tell(
                `§b[${PLUGIN_NAME}] §e${nama} §b上传成功 WarpID 为 §e${id}`)
        }

    },
    /** 写入 Date 类型文件
     * @param filePath 文件路径
     * @param fileName 文件名称
     * @param content 内容
     */
    WriteDateWarp: function (filePath, fileName, content) {
        // 更新 Date 文件        
        WarpList = FileOppeate.FileRead(filePath, fileName)
        WarpList.push(content)
        FileOppeate.FileWrite(filePath, fileName, JSON.stringify(WarpList, null, 4))
    },
    /** 写入 Player 类型文件
     * @param filePath 文件路径
     * @param fileName 文件名称
     * @param pl 玩家对象
     * @param content 内容
     */
    WritePlayerWarp: function (filePath, fileName, pl, content) {    // 更新 PlayerDate 文件
        WarpList = FileOppeate.FileRead(filePath, fileName)
        if (WarpList[`${pl.name}`] == undefined) {
            array = []
            array.push(content)
            WarpList[`${pl.name}`] = array
        } else {
            array = WarpList[`${pl.name}`]
            array.push(content)
            WarpList[`${pl.name}`] = array
        }
        FileOppeate.FileWrite(filePath, fileName, JSON.stringify(WarpList , null, 4))
    },
    /** 传送玩家
     * @descirption 读取 Post 信息并对 pl 进行传送
     * @param filePath 文件路径
     * @param fileName 文件名称
     * @param pl 玩家对象
     * @param content 内容
     */
    TpWarp: function (pl, post) {
        switch (post[3]) {
            case "Overworld":
                pl.teleport(post[0], post[1], post[2], 0)
                return pl.tell(`§b[${PLUGIN_NAME}] 传送成功`)
            case "Nether":
                pl.teleport(post[0], post[1], post[2], 1)
                return pl.tell(`§b[${PLUGIN_NAME}] 传送成功`)
            case "End":
                pl.teleport(post[0], post[1], post[2], 2)
                return pl.tell(`§b[${PLUGIN_NAME}] 传送成功`)
            // LL 2.5.1 中文匹配
            case "主世界":
                pl.teleport(post[0], post[1], post[2], 0)
                return pl.tell(`§b[${PLUGIN_NAME}] 传送成功`)
            case "下界":
                pl.teleport(post[0], post[1], post[2], 1)
                return pl.tell(`§b[${PLUGIN_NAME}] 传送成功`)
            case "末地":
                pl.teleport(post[0], post[1], post[2], 2)
                return pl.tell(`§b[${PLUGIN_NAME}] 传送成功`)
            case "null":
                if ( Number(`${VERSION[0]}.${VERSION[1]}${VERSION[2]}`) < 0.82 ) {
                    logger.warning("请及时更新本插件！更新地址：https://github.com/Moxiner/ShareWarp/releases/latest")
                    logger.warning("如果您的插件版本在 v0.8.2 及以上，请联系作者 Moxiner 获取帮助")
                    return pl.tell(`§c[${PLUGIN_NAME}] 传送失败，请联系腐竹！`)

                } else {
                    logger.warning(`传送失败，请联系作者 Moxiner 获取帮助`)
                    return pl.tell(`§c[${PLUGIN_NAME}] 传送失败，请联系腐竹！`)
                }

        }
    },
    /** 处理 TpWarp 请求
     * @despcription 载入 Post 数据并传入 TpWarp()
     * @param pl 玩家对象
     * @param date 表单数据
     */
    DealTpWarp: function (pl, date) {
        if (date != null) {
            let warp = FileOppeate.FileRead(CONFIG.PATH, CONFIG.STAR)[pl.name][date]
            PlayerWarp[`${pl.name}`] = warp
            DateDeal.TpWarp(pl, warp.post)
        }

    },
    /**  收藏 Warp
     * @despcription 载入 Warp 数据并检查是否已经在 STAR 里，如果没有，则写入进 STAR 里
     * @param pl 玩家对象
     * @param content 个人传送点数据
     */
    StarWarp: function (pl, content) {
        starWarp = FileOppeate.FileRead(CONFIG.PATH, CONFIG.STAR)[pl.name]
        for (i in starWarp) {
            if (starWarp[i].id == content.id) {
                return pl.tell(`§e[${PLUGIN_NAME}] 已经收藏过 §6'${content.name}' §e了哦！`)
            }

        }
        DateDeal.WritePlayerWarp(CONFIG.PATH, CONFIG.STAR, pl, content)
        return pl.tell(`§b[${PLUGIN_NAME}] §e'${content.name}'§b 已添加到收藏！`)
    },
    /**  管理传送点
    * @despcription 接收 Manage 返回的表单 并作出相应处理
    * @param pl 玩家对象
    * @param date 表单数据
    */
    DealManage: function (pl, date) {
        warp = PlayerWarp[pl.name]
        switch (date) {
            case 0:
                GUI.Ready(pl, DateDeal.ReadyDel)
                return false

            case 1:
                let content = `
§bWarpID: §6${warp.id}
§b详情: §6${warp.des}
§b传主: §6${warp.op}
§b位置: §6坐标§e ${warp.post[0]} ${warp.post[1]} ${warp.post[2]} 
        §6维度§e ${warp.post[3]}
                `
                return GUI.describe(pl, warp.name, content, DateDeal.DealDescribeWarp)
            case 2:
                GUI.warp(pl, WarpList[pl.name], DateDeal.Manage)
                return false

        }

    },
    /**  预处理管理传送点
    * @despcription 进行表单处理 并将数据返回至 Manage
    * @param pl 玩家对象
    * @param date 表单数据
    */
    Manage: function (pl, date) {
        if (date != null) {
            mode = ManageMode[pl.name]
            var warp = []
            if (mode == CONFIG.LIST) {
                warp = FileOppeate.FileRead(CONFIG.PATH, CONFIG.LIST)[date]
            } else {
                warp = FileOppeate.FileRead(CONFIG.PATH, mode)[pl.name][date]
            }
            PlayerWarp[`${pl.name}`] = warp
            GUI.Manage(pl, warp.name, DateDeal.DealManage)

        }
    },
    /**  预处理管理传送点
    * @despcription 进行表单处理 并将数据返回至 Manage
    * @param pl 玩家对象
    * @param warp 个人领地对象
    * @param filePath 文件路径
    * @param fileName 文件名称
    */
    Delete: function (_pl, warp, filePath, fileName) {
        if (fileName == CONFIG.LIST) {
            var filedate = FileOppeate.FileRead(filePath, fileName)
            for (i in filedate) {
                if (filedate[i].id == warp.id) {
                    filedate.splice(i, 1);
                }
            }
            return FileOppeate.FileWrite(filePath, fileName, JSON.stringify(filedate, null, 4))
        } else {
            var filedate = FileOppeate.FileRead(filePath, fileName)
            for (p in filedate) {
                filelist = filedate[p]
                for (i in filelist) {
                    if (filelist[i].id == warp.id) {
                        filelist.splice(i, 1);
                    }
                }
                filedate[p] = filelist
            }
            return FileOppeate.FileWrite(filePath, fileName, JSON.stringify(filedate, null, 4))
        }
    },
    /**  预处理管理传送点
   * @despcription 根据 DelManage 返回的数据做出是否 Delect 和 Delect 不同列表 Warp 的指令
   * @param pl 玩家对象
   * @param date 表单数据
   */
    ReadyDel: function (pl, date) {
        if (date == 1) {
            switch (mode) {
                case CONFIG.LIST:
                    DateDeal.Delete(pl, warp, CONFIG.PATH, CONFIG.LIST, CONFIG.LIST)
                    DateDeal.Delete(pl, warp, CONFIG.PATH, CONFIG.PONSER, CONFIG.PONSER)
                    DateDeal.Delete(pl, warp, CONFIG.PATH, CONFIG.STAR, CONFIG.STAR)
                    return pl.tell(`§b[${PLUGIN_NAME}] §e'${warp.name}' §b删除成功`)
                case CONFIG.PONSER:
                    DateDeal.Delete(pl, warp, CONFIG.PATH, CONFIG.LIST, CONFIG.LIST)
                    DateDeal.Delete(pl, warp, CONFIG.PATH, CONFIG.PONSER, CONFIG.PONSER)
                    DateDeal.Delete(pl, warp, CONFIG.PATH, CONFIG.STAR, CONFIG.STAR)
                    return pl.tell(`§b[${PLUGIN_NAME}] §e'${warp.name}' §b删除成功`)
                case CONFIG.STAR:
                    DateDeal.Delete(pl, warp, CONFIG.PATH, CONFIG.STAR, CONFIG.PONSER)
                    return pl.tell(`§b[${PLUGIN_NAME}] §e'${warp.name}' §b已从收藏中删除`)
            }
        }
    },
    /**  读取 WarpID
    * @despcription 读取 FIle 的 WarpList 并 返回仅带有 WarpID 的数组
    * @param pl 玩家对象
    * @param filePath 文件路径
    * @param fileName 文件名称
    */
    ReadWarpID: function (pl, filePath, fileName) {
        let warpList = []
        if (fileName == CONFIG.LIST) {
            var warp = FileOppeate.FileRead(filePath, fileName);
        } else {
            var warp = FileOppeate.FileRead(filePath, fileName)[pl.name];
        }
        for (var i in warp) {
            warpList.push(warp[i].id)
        }
        return warpList
    }

}

/* 监听器 */
var onListen = {

    /** 指令监听器 */
    onCmd: function () {
        try {
            let cmd = mc.newCommand("sharewarp", "共享传送点", PermType.Any);
            cmd.setAlias("sw");
            cmd.setEnum("Mode", ["list", "tp"]);
            cmd.setEnum("Update", ["update"]);
            cmd.setEnum("Help", ["help"]);
            cmd.setEnum("Manage", ["manage"]);
            cmd.setEnum("ManageContent", ["star", "ponser", "global"]);
            cmd.mandatory("Mode", ParamType.Enum, "Mode", 1);
            cmd.mandatory("Mode", ParamType.Enum, "Update", 1);
            cmd.mandatory("Mode", ParamType.Enum, "Manage", 1);
            cmd.mandatory("Mode", ParamType.Enum, "Help", 1);
            cmd.optional("ID", ParamType.Int, "ID", 1);
            cmd.mandatory("ManageContent", ParamType.Enum, "ManageContent", 1);
            cmd.overload(["Update"]);
            cmd.overload(["Manage", "ManageContent", "ID"]);
            cmd.overload(["Mode", "ID"]);
            cmd.overload(["Help"]);
            cmd.setCallback((_cmd, ori, out, res) => {
                switch (res.Mode) {
                    case "list":
                        // 输入 list 指令时触发效果 （ID可选）
                        if (res.ID == null) {
                            var warplist = DateDeal.ReadWarp(CONFIG.PATH, CONFIG.LIST, ori.player)
                            WarpList[ori.name] = warplist
                            GUI.warp(ori.player, WarpList[ori.name], DateDeal.DescribeWarp)
                            return false
                        } else {
                            var WarpIDList = DateDeal.ReadWarpID(ori.player, CONFIG.PATH, CONFIG.LIST)
                            var warpList = FileOppeate.FileRead(CONFIG.PATH, CONFIG.LIST)
                            WarpList[ori.name] = warplist
                            for (i in WarpIDList) {
                                if (WarpIDList[i] == res.ID) {
                                    return DateDeal.DescribeWarp(ori.player, i)
                                }
                            }
                            return out.success(`§e[${PLUGIN_NAME}] WarpID 不存在或该传送点已被删除！`)
                        }
                    case "tp":
                        // 输入 Tp 指令时触发效果 （ID可选）
                        if (res.ID == null) {
                            var warplist = DateDeal.ReadWarp(CONFIG.PATH, CONFIG.STAR, ori.player, "ponser")
                            WarpList[ori.name] = warplist
                            GUI.warp(ori.player, warplist, DateDeal.DealTpWarp)
                            return false
                        } else {
                            var WarpIDList = DateDeal.ReadWarpID(ori.player, CONFIG.PATH, CONFIG.LIST)
                            var warpList = FileOppeate.FileRead(CONFIG.PATH, CONFIG.LIST)
                            WarpList[ori.name] = warplist
                            for (i in WarpIDList) {
                                if (WarpIDList[i] == res.ID) {
                                    return DateDeal.TpWarp(ori.player, warpList[i].post)
                                }
                            }
                            return out.success(`§e[${PLUGIN_NAME}] WarpID 不存在或该传送点已被删除！`)
                        }
                    case "update":
                        // 输入 Update 指令时触发效果 （ID可选）
                        GUI.Upadte(ori.player, DateDeal.UpdateWarp)
                        return false
                    case "manage":
                        // 输入 manage 指令时触发效果 （ID可选）
                        switch (res.ManageContent) {
                            case "star":
                                if (res.ID == null) {
                                    var warplist = DateDeal.ReadWarp(CONFIG.PATH, CONFIG.STAR, ori.player, "mode")
                                    WarpList[ori.name] = warplist
                                    ManageMode[ori.name] = CONFIG.STAR
                                    return GUI.warp(ori.player, WarpList[ori.name], DateDeal.Manage)
                                } else {
                                    var WarpIDList = DateDeal.ReadWarpID(ori.player, CONFIG.PATH, CONFIG.STAR)
                                    var warplist = DateDeal.ReadWarp(CONFIG.PATH, CONFIG.STAR, ori.player, "mode")
                                    WarpList[ori.name] = warplist
                                    ManageMode[ori.name] = CONFIG.STAR
                                    for (i in WarpIDList) {
                                        if (WarpIDList[i] == res.ID) {
                                            return DateDeal.Manage(ori.player, i);
                                        }
                                    }
                                    return out.success(`§e[${PLUGIN_NAME}] WarpID 不存在或该传送点已被删除！`)
                                }

                            case "ponser":
                                if (res.ID == null) {
                                    var warplist = DateDeal.ReadWarp(CONFIG.PATH, CONFIG.PONSER, ori.player, "mode")
                                    WarpList[ori.name] = warplist
                                    ManageMode[ori.name] = CONFIG.PONSER
                                    return GUI.warp(ori.player, WarpList[ori.name], DateDeal.Manage)
                                } else {
                                    var WarpIDList = DateDeal.ReadWarpID(ori.player, CONFIG.PATH, CONFIG.PONSER)
                                    var warplist = DateDeal.ReadWarp(CONFIG.PATH, CONFIG.PONSER, ori.player, "mode")
                                    WarpList[ori.name] = warplist
                                    ManageMode[ori.name] = CONFIG.STAR
                                    for (i in WarpIDList) {
                                        if (WarpIDList[i] == res.ID) {
                                            return DateDeal.Manage(ori.player, i);
                                        }
                                    }
                                    return out.success(`§e[${PLUGIN_NAME}] WarpID 不存在或该传送点已被删除！`)
                                }
                            case "global":
                                if (ori.player.isOP() == 0) {
                                    return out.error(`[${PLUGIN_NAME}] 您没有权限使用该指令`)
                                } else {
                                    if (res.ID == null) {
                                        var warplist = DateDeal.ReadWarp(CONFIG.PATH, CONFIG.LIST, ori.player)
                                        WarpList[ori.name] = warplist
                                        ManageMode[ori.name] = CONFIG.LIST
                                        GUI.warp(ori.player, WarpList[ori.name], DateDeal.Manage)
                                    } else {
                                        var WarpIDList = DateDeal.ReadWarpID(ori.player, CONFIG.PATH, CONFIG.LIST)
                                        var warplist = DateDeal.ReadWarp(CONFIG.PATH, CONFIG.PONSER, ori.LIST, "mode")
                                        WarpList[ori.name] = warplist
                                        ManageMode[ori.name] = CONFIG.LIST
                                        for (i in WarpIDList) {
                                            if (WarpIDList[i] == res.ID) {
                                                return DateDeal.Manage(ori.player, i);
                                            }
                                        }
                                        return out.success(`§e[${PLUGIN_NAME}] WarpID 不存在或该传送点已被删除！`)
                                    }
                                }
                        }   
                        return false
                    case "help":
                        content = `
§bShareWarp §e指令说明
§a指令
§b/sharewarp list [WarpID] §f—— §2共享传送点列表
§b/sharewarp tp [WarpID] §f—— §2收藏传送点列表
§b/sharewarp update §f—— §2上传传送点
§b/sharewarp manage [star ; ponser ; global] [WarpID] §f—— §2管理传送点
§a参数说明
§6/sharewarp §g可以使用 §6/sw 代替
§b[WarpID] §f—— §2直接跳转该 Warp (可选参数)
§b[star] §f—— §2管理您收藏的传送点
§b[ponser] §f—— §2管理您上传的传送点
§b[global] §f—— §2管理全服传送点 (仅管理员可用)
                    `
                        return out.success(content)

                }
            });
            cmd.setup();
        } catch {
            logger.error(`[Error] 指令执行错误!`)
            logger.error(`[Error] 请联系作者进行维护或更新`)
        }

    }
}

// 主程序
try {
    mc.listen("onServerStarted", onListen.onCmd);
    DateDeal.Initialize(CONFIG.PATH, CONFIG.LIST, "[]");
    DateDeal.Initialize(CONFIG.PATH, CONFIG.PONSER, "{}");
    DateDeal.Initialize(CONFIG.PATH, CONFIG.STAR, "{}");
    logger.log(`ShareWarp 加载完成`)
    logger.log(`作者: ${AUTHOR} 版本: ${VERSION[0]}.${VERSION[1]}.${VERSION[2]}`)
} catch {
    logger.error(`[Error] 插件加载失败`)
}

