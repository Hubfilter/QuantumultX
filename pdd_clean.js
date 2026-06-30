/*
 * 拼多多（PDD）底栏及首页纯 JS 强力洗包脚本
 * 适用版本：iOS Pinduoduo 8.14.0+
 */

let url = $request.url;
let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);

        // 1. 针对 AMDC 调度网关的强行熔断
        if (url.indexOf("amdc.m.taobao.com") !== -1) {
            obj = { "data": {}, "code": "200" };
        }

        // 2. 净化底栏（精准切除“多多视频”和营销 Tab）
        if (url.indexOf("/api/fresnel/v") !== -1 && url.indexOf("/tabs") !== -1) {
            if (obj.data && obj.data.tabs) {
                // 核心逻辑：只保留首页、分类、聊天、个人中心，凡是包含“视频/大促/返场”的Tab全部抹除
                obj.data.tabs = obj.data.tabs.filter(tab => {
                    const hasVideo = tab.text && (tab.text.includes("视频") || tab.text.includes("返场") || tab.text.includes("大促"));
                    const isCoreRoute = tab.link_url && (tab.link_url.includes("index") || tab.link_url.includes("classification") || tab.link_url.includes("chat") || tab.link_url.includes("me"));
                    return isCoreRoute && !hasVideo;
                });
            }
        }

        // 3. 净化首页（精简金刚位、屏蔽限时秒杀、多多买菜、推金币）
        if (url.indexOf("/api/fresnel/v") !== -1 && url.indexOf("/index") !== -1) {
            if (obj.data) {
                if (obj.data.top_banners) delete obj.data.top_banners;
                if (obj.data.buffer_tiles) obj.data.buffer_tiles = [];
                if (obj.data.operation_widgets) {
                    obj.data.operation_widgets = obj.data.operation_widgets.filter(widget => {
                        return !(widget.title && /秒杀|买菜|金币|9.9|特卖|果园|现金|抽奖/.test(widget.title));
                    });
                }
            }
        }

        body = JSON.stringify(obj);
    } catch (e) {
        console.log("PDD JS 净化脚本执行出错: " + e);
    }
}

$done({ body });
