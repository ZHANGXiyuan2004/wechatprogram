#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/common.sh"

print_title "健康检查（零基础版）"

printf "运行环境检查：\n"
if command -v node >/dev/null 2>&1; then
  printf "[通过] Node.js: %s\n" "$(node -v)"
else
  printf "[失败] 未安装 Node.js\n"
fi

if command -v corepack >/dev/null 2>&1; then
  printf "[通过] corepack 可用\n"
else
  printf "[失败] corepack 不可用\n"
fi

print_line
printf "进程检查：\n"
for name in api admin-web mini-web; do
  pid_file="$RUN_DIR/${name}.pid"
  if [ -f "$pid_file" ]; then
    pid="$(cat "$pid_file" 2>/dev/null || true)"
    if is_pid_running "$pid"; then
      printf "[运行中] %s (PID: %s)\n" "$name" "$pid"
    else
      printf "[异常] %s PID 文件存在但进程不在\n" "$name"
    fi
  else
    printf "[未启动] %s\n" "$name"
  fi
done

print_line
printf "接口检查：\n"
if http_ok "http://127.0.0.1:3000/api/docs"; then
  printf "[通过] API\n"
else
  printf "[失败] API\n"
fi

if http_ok "http://127.0.0.1:5174"; then
  printf "[通过] 管理后台\n"
else
  printf "[失败] 管理后台\n"
fi

if http_ok "http://127.0.0.1:5173"; then
  printf "[通过] 小程序预览\n"
else
  printf "[失败] 小程序预览\n"
fi

print_line
printf "日志路径：\n%s\n" "$LOG_DIR"
pause_and_exit
