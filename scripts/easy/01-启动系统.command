#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/common.sh"

print_title "启动系统（零基础版）"

require_cmd node "请先安装 Node.js 20+: https://nodejs.org/"
require_cmd corepack "当前系统未找到 corepack，请先升级 Node.js 到 20+"
require_cmd curl "当前系统未找到 curl，请联系维护人员"
require_node_version
ensure_repo_manifest
prepare_pnpm

if [ ! -d "$ROOT_DIR/node_modules" ]; then
  printf "检测到依赖未安装，先执行安装...\n"
  pnpm_exec install
fi

print_line
printf "正在做启动前自检（约 10~30 秒）...\n"
pnpm_exec --filter @asrllm/shared-types build
pnpm_exec --filter @asrllm/ai-gateway build
pnpm_exec --filter @asrllm/api build

# 先停掉旧进程，避免端口占用
stop_service api || true
stop_service admin-web || true
stop_service mini-web || true

print_line
printf "正在启动 3 个服务，请稍候...\n"

start_service "api" "COREPACK_HOME=/tmp/corepack corepack pnpm --filter @asrllm/api dev"
start_service "admin-web" "COREPACK_HOME=/tmp/corepack corepack pnpm --filter @asrllm/admin-web exec vite --host 127.0.0.1 --port 5174 --strictPort"
start_service "mini-web" "COREPACK_HOME=/tmp/corepack corepack pnpm --filter @asrllm/mini exec vite --host 127.0.0.1 --port 5173 --strictPort"

sleep 2
print_line
printf "服务地址：\n"
printf '%s\n' "- 管理后台: http://127.0.0.1:5174"
printf '%s\n' "- 小程序预览: http://127.0.0.1:5173"
printf '%s\n' "- API 文档:   http://127.0.0.1:3000/api/docs"

print_line
printf "健康检查：\n"
if wait_http_ready "http://127.0.0.1:3000/api/docs" 25; then
  printf "[通过] API 已启动\n"
else
  printf "[异常] API 未正常响应，请看日志: %s\n" "$LOG_DIR/api.log"
fi

if wait_http_ready "http://127.0.0.1:5174" 20; then
  printf "[通过] 管理后台已启动\n"
else
  printf "[异常] 管理后台未正常响应，请看日志: %s\n" "$LOG_DIR/admin-web.log"
fi

if wait_http_ready "http://127.0.0.1:5173" 20; then
  printf "[通过] 小程序预览已启动\n"
else
  printf "[异常] 小程序预览未正常响应，请看日志: %s\n" "$LOG_DIR/mini-web.log"
fi

print_line
printf "自动打开浏览器：\n"
if http_ok "http://127.0.0.1:5174"; then
  open_url "http://127.0.0.1:5174"
  printf "[已打开] 管理后台\n"
else
  printf "[跳过] 管理后台未就绪\n"
fi

if http_ok "http://127.0.0.1:5173"; then
  open_url "http://127.0.0.1:5173"
  printf "[已打开] 小程序预览\n"
else
  printf "[跳过] 小程序预览未就绪\n"
fi

print_line
printf "如需关闭服务，请双击：02-停止系统.command\n"
printf "如需排错，请双击：03-健康检查.command\n"
pause_and_exit
