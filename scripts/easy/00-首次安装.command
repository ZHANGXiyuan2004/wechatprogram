#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/common.sh"

print_title "首次安装（零基础版）"

require_cmd node "请先安装 Node.js 20+: https://nodejs.org/"
require_cmd corepack "当前系统未找到 corepack，请先升级 Node.js 到 20+"
require_node_version
ensure_repo_manifest

printf "[1/3] 准备 pnpm...\n"
prepare_pnpm

printf "[2/3] 安装依赖（首次会较慢）...\n"
if ! pnpm_exec install --prefer-offline; then
  print_line
  printf "[错误] 依赖安装失败。\n"
  printf "常见原因：网络或 DNS 异常（例如 ENOTFOUND）。\n"
  printf "请先检查网络，或切换热点后重试。\n"
  pause_and_exit
  exit 1
fi

printf "[3/3] 验证编译（确保可运行）...\n"
if ! pnpm_exec -r build; then
  print_line
  printf "[错误] 编译验证失败，请将终端截图发给技术同事。\n"
  pause_and_exit
  exit 1
fi

printf '\n安装完成。你现在可以双击：01-启动系统.command\n'
pause_and_exit
