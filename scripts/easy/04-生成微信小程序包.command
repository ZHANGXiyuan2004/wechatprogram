#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/common.sh"

print_title "生成微信小程序包（零基础版）"

require_cmd node "请先安装 Node.js 20+: https://nodejs.org/"
require_cmd corepack "当前系统未找到 corepack，请先升级 Node.js 到 20+"
require_node_version
ensure_repo_manifest
prepare_pnpm

MANIFEST_PATH="$ROOT_DIR/apps/mini/src/manifest.json"
if [ ! -f "$MANIFEST_PATH" ]; then
  printf "[错误] 未找到文件: %s\n" "$MANIFEST_PATH"
  pause_and_exit
  exit 1
fi

APPID="$(node -e "const fs=require('fs');const p=process.argv[1];const j=JSON.parse(fs.readFileSync(p,'utf8'));const v=(j['mp-weixin']&&j['mp-weixin'].appid)||'';process.stdout.write(v);" "$MANIFEST_PATH")"

if [ -z "$APPID" ]; then
  print_line
  printf "[错误] 未配置微信小程序 AppID。\n"
  printf "请先编辑：%s\n" "$MANIFEST_PATH"
  printf "把 mp-weixin.appid 改为你的真实 AppID。\n"
  pause_and_exit
  exit 1
fi

if [ "$APPID" = "wx-demo-appid" ]; then
  print_line
  printf "[错误] 当前 AppID 仍是示例值：wx-demo-appid\n"
  printf "请先编辑：%s\n" "$MANIFEST_PATH"
  printf "把 mp-weixin.appid 改为你的真实 AppID。\n"
  pause_and_exit
  exit 1
fi

if [ ! -d "$ROOT_DIR/node_modules" ]; then
  printf "检测到依赖未安装，先执行安装...\n"
  if ! pnpm_exec install --prefer-offline; then
    print_line
    printf "[错误] 依赖安装失败。常见原因是网络异常（ENOTFOUND）。\n"
    printf "请检查网络后重试。\n"
    pause_and_exit
    exit 1
  fi
fi

printf "[1/3] 校验 AppID... 通过 (%s)\n" "$APPID"

printf "[2/3] 生成微信小程序包（mp-weixin）...\n"
BUILD_OK=1
if ! pnpm_exec --filter @asrllm/mini build:mp-weixin; then
  BUILD_OK=0
fi

OUTPUT_DIR=""
for candidate in \
  "$ROOT_DIR/apps/mini/dist/build/mp-weixin" \
  "$ROOT_DIR/apps/mini/unpackage/dist/build/mp-weixin"; do
  if [ -f "$candidate/app.json" ]; then
    OUTPUT_DIR="$candidate"
    break
  fi
done

if [ -z "$OUTPUT_DIR" ]; then
  maybe_app_json="$(find "$ROOT_DIR/apps/mini" -type f -name app.json | rg '/mp-weixin/' | head -n1 || true)"
  if [ -n "$maybe_app_json" ]; then
    OUTPUT_DIR="$(dirname "$maybe_app_json")"
  fi
fi

if [ -z "$OUTPUT_DIR" ]; then
  OUTPUT_DIR="$ROOT_DIR/apps/mini/dist/build/mp-weixin-wrapper"
  H5_URL="${ASRLLM_MINI_H5_URL:-http://127.0.0.1:5173}"

  rm -rf "$OUTPUT_DIR"
  mkdir -p "$OUTPUT_DIR/pages/index" "$OUTPUT_DIR/pages/h5"

  cat >"$OUTPUT_DIR/app.js" <<'EOF'
App({});
EOF

  cat >"$OUTPUT_DIR/app.json" <<'EOF'
{
  "pages": [
    "pages/index/index",
    "pages/h5/index"
  ],
  "window": {
    "navigationBarTitleText": "ASRLLM 调试壳",
    "navigationBarBackgroundColor": "#ffffff",
    "navigationBarTextStyle": "black"
  }
}
EOF

  cat >"$OUTPUT_DIR/app.wxss" <<'EOF'
page {
  background: #f8fafc;
}
EOF

  cat >"$OUTPUT_DIR/pages/index/index.json" <<'EOF'
{
  "navigationBarTitleText": "ASRLLM 调试入口"
}
EOF

  cat >"$OUTPUT_DIR/pages/index/index.wxml" <<'EOF'
<view class="page">
  <view class="card">
    <view class="title">调试壳已生成</view>
    <view class="desc">点击按钮后会打开本机 H5 联调页面。</view>
    <view class="desc">请先在电脑上执行 01-启动系统.command。</view>
    <button class="btn" bindtap="goH5">打开训练页面</button>
  </view>
</view>
EOF

  cat >"$OUTPUT_DIR/pages/index/index.wxss" <<'EOF'
.page {
  padding: 24rpx;
}
.card {
  background: #fff;
  border-radius: 16rpx;
  border: 1px solid #e2e8f0;
  padding: 24rpx;
}
.title {
  font-size: 34rpx;
  font-weight: 700;
  margin-bottom: 12rpx;
}
.desc {
  color: #475569;
  margin-bottom: 8rpx;
  line-height: 1.6;
}
.btn {
  margin-top: 14rpx;
  background: #0ea5e9;
  color: #fff;
  border-radius: 12rpx;
}
EOF

  cat >"$OUTPUT_DIR/pages/index/index.js" <<'EOF'
Page({
  goH5() {
    wx.navigateTo({
      url: '/pages/h5/index'
    });
  }
});
EOF

  cat >"$OUTPUT_DIR/pages/h5/index.json" <<'EOF'
{
  "navigationBarTitleText": "训练页面（H5）"
}
EOF

  cat >"$OUTPUT_DIR/pages/h5/index.wxml" <<'EOF'
<web-view src="{{src}}"></web-view>
EOF

  cat >"$OUTPUT_DIR/pages/h5/index.js" <<EOF
Page({
  data: {
    src: '${H5_URL}'
  }
});
EOF
  BUILD_MODE="WRAPPER"
else
  BUILD_MODE="NATIVE"
fi

PROJECT_CONFIG="$OUTPUT_DIR/project.config.json"
cat >"$PROJECT_CONFIG" <<EOF
{
  "description": "ASRLLM mini program output",
  "packOptions": {
    "ignore": []
  },
  "setting": {
    "urlCheck": false,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "minified": false
  },
  "compileType": "miniprogram",
  "appid": "$APPID",
  "projectname": "asrllm-mini",
  "libVersion": "latest",
  "miniprogramRoot": "./"
}
EOF

printf "[3/3] 完成\n"
print_line
if [ "$BUILD_MODE" = "NATIVE" ]; then
  printf "已生成【原生微信小程序包】\n"
else
  printf "未检测到原生 mp-weixin 产物，已生成【调试壳（web-view）】\n"
  if [ "$BUILD_OK" -eq 0 ]; then
    printf "提示：构建阶段有报错，已自动回退到调试壳模式。\n"
  fi
fi
printf "\n微信小程序包目录：\n%s\n" "$OUTPUT_DIR"
printf "\n下一步：\n"
printf "1. 打开微信开发者工具\n"
printf "2. 选择“导入项目”\n"
printf "3. 项目目录选：%s\n" "$OUTPUT_DIR"
printf "4. AppID 选：%s\n" "$APPID"
if [ "$BUILD_MODE" = "WRAPPER" ]; then
  printf "\n5. 先双击 01-启动系统.command，保证 http://127.0.0.1:5173 可访问\n"
  printf "6. 在开发者工具中点击“打开训练页面”进入联调\n"
fi

if command -v open >/dev/null 2>&1; then
  open "$OUTPUT_DIR" >/dev/null 2>&1 || true
fi

pause_and_exit
