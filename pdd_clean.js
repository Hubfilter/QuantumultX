//  2025-07-31 (2026 圈X规范修正版)
//  树先生
//  当前文件内容仅供个人学习和研究使用，若使用过程中发生任何问题概不负责

let url = $request.url;
let body = $response.body;

if (body) {
  try {
    let obj = JSON.parse(body);

    if (url.indexOf("/homepage/hub") != -1) {
      // 1. 过滤底部菜单
      const tabArray = ["首页", "聊天", "个人中心"];
      if (obj?.result?.bottom_tabs) {
        obj.result.bottom_tabs = obj.result.bottom_tabs.filter(tab => tabArray.includes(tab.title));
      }

      // 2. 过滤首页顶部菜单频道
      if (obj?.result?.all_top_opts) {
        obj.result.all_top_opts = [];
      }

      // 3. 移除搜索栏热搜词
      if (obj?.result) {
        delete obj.result.search_bar_hot_query;
      }
      
      // 4. 过滤核心金刚位与广告模块
      const adArray = [
        "irregular_banner_dy", 
        "irregular_banner", 
        "ad_module", 
        "icon_set",
        "recommend_fresh_info",
        "timeline"
      ];
      if (obj?.result?.module_order) {
        obj.result.module_order = obj.result.module_order.filter(tab => !adArray.includes(tab.module_name));
      }
    }

    body = JSON.stringify(obj);

  } catch (error) {
    console.log("拼多多脚本执行出错:" + error.message);
  }
}

$done({ body: body });
