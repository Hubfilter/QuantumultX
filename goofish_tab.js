/**
 * 闲鱼底栏/同城暴力重组脚本
 */

let body = $response.body;
if (body) {
    try {
        let obj = JSON.parse(body);
        
        // 1. 强力清除可能存在的各种动态配置 Tab 节点
        const tabKeys = ['tabs', 'tabList', 'bottomTabs', 'bottomTabList', 'footerTabs', 'nodes'];
        
        function cleanTabs(node) {
            if (!node || typeof node !== 'object') return;
            for (let key in node) {
                if (tabKeys.includes(key) && Array.isArray(node[key])) {
                    // 只保留名字属于 首页、发布、消息、我的 的 Tab 
                    node[key] = node[key].filter(tab => {
                        let name = tab.title || tab.name || tab.tabName || tab.text || "";
                        return /首页|发布|消息|我的|home|publish|message|my|chat/i.test(name);
                    });
                } else if (typeof node[key] === 'object') {
                    cleanTabs(node[key]);
                }
            }
        }
        
        cleanTabs(obj);
        
        // 2. 针对特殊容器(如全局配置)直接进行高强度过滤
        if (obj.data) {
            if (obj.data.tabs) {
                obj.data.tabs = obj.data.tabs.filter(t => /首页|发布|消息|我的/.test(t.title || t.name));
            }
            // 彻底切除可能存在的同城/营销框架入口
            if (obj.data.sections) {
                obj.data.sections = obj.data.sections.filter(s => !/local|city|nearby|town/i.test(s.sectionCode || s.sectionBizCode || ""));
            }
        }

        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
