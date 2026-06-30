/**
 * 闲鱼界面数据无差别地毯式清洗脚本
 */

let body = $response.body;
if (body) {
    try {
        let obj = JSON.parse(body);

        // 1. 定义需要抹除的牛皮癣关键词（黑名单）
        const blackWords = /同城|城市|附近|nearby|local|city|town|sign|签到|打卡|集市|market|fish/i;
        
        // 2. 深度优先遍历（全面清洗所有包含敏感词的 Tab、按钮、组件和悬浮挂件）
        function deepClean(node) {
            if (!node || typeof node !== 'object') return;
            
            for (let key in node) {
                let val = node[key];
                
                // 处理数组（比如组件列表、Tab列表、横幅列表等）
                if (Array.isArray(val)) {
                    node[key] = val.filter(item => {
                        if (!item) return false;
                        // 提取可能的名称/标题
                        let name = item.title || item.name || item.tabName || item.text || item.sectionCode || item.sectionBizCode || "";
                        // 如果命中黑名单，直接干掉
                        if (blackWords.test(name)) return false;
                        return true;
                    });
                    // 对数组留下的子项继续深挖
                    node[key].forEach(subItem => deepClean(subItem));
                } 
                // 处理嵌套对象
                else if (typeof val === 'object') {
                    deepClean(val);
                }
            }
        }

        // 执行全局地毯式清洗
        deepClean(obj);

        // 3. 针对特殊的全局根节点强制降维打击
        if (obj.data) {
            // 清空所有顶部的营销/签到入口挂件
            if (obj.data.homeTopList) obj.data.homeTopList = [];
            if (obj.data.top_banners) obj.data.top_banners = [];
            // 只保留四大核心Tab的终极防线
            if (obj.data.tabs) {
                obj.data.tabs = obj.data.tabs.filter(t => /首页|发布|消息|我的/.test(t.title || t.name || ""));
            }
        }

        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
