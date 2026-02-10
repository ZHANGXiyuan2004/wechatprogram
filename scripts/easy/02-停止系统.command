#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/common.sh"

print_title "停止系统（零基础版）"

stop_service api
stop_service admin-web
stop_service mini-web

printf '\n所有已记录服务已停止。\n'
pause_and_exit
